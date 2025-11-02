use starknet::ContractAddress;
use memorabilia::models::game_state::{GameState, GameStatus, GameStateTrait};
use memorabilia::models::card::Card;
use memorabilia::utils::card_generator::generate_card_deck;
use memorabilia::utils::scoring::calculate_score;

#[derive(Drop, Serde)]
#[dojo::event]
pub struct GameStarted {
    #[key]
    pub game_id: u32,
    pub player: ContractAddress,
    pub difficulty: u8,
    pub timestamp: u64,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct CardFlipped {
    #[key]
    pub game_id: u32,
    pub card_index: u8,
    pub card_value: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct CardsMatched {
    #[key]
    pub game_id: u32,
    pub card1_index: u8,
    pub card2_index: u8,
    pub value: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct CardsMismatched {
    #[key]
    pub game_id: u32,
    pub card1_index: u8,
    pub card2_index: u8,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct GameCompleted {
    #[key]
    pub game_id: u32,
    pub player: ContractAddress,
    pub moves: u32,
    pub time: u64,
    pub score: u32,
}

#[dojo::interface]
trait IGameSystem {
    fn start_game(ref world: IWorldDispatcher, difficulty: u8) -> u32;
    fn flip_card(ref world: IWorldDispatcher, game_id: u32, card_index: u8);
    fn check_match(ref world: IWorldDispatcher, game_id: u32) -> bool;
    fn get_game(world: @IWorldDispatcher, game_id: u32) -> GameState;
    fn abandon_game(ref world: IWorldDispatcher, game_id: u32);
}

#[dojo::contract]
mod game_system {
    use super::{
        GameState, GameStatus, GameStateTrait, Card,
        generate_card_deck, calculate_score,
        GameStarted, CardFlipped, CardsMatched, CardsMismatched, GameCompleted,
        IGameSystem
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use core::poseidon::poseidon_hash_span;
    
    #[abi(embed_v0)]
    impl GameSystemImpl of IGameSystem<ContractState> {
        fn start_game(ref world: IWorldDispatcher, difficulty: u8) -> u32 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Validate difficulty
            assert(difficulty >= 1 && difficulty <= 3, 'Invalid difficulty');
            
            // Generate unique game_id
            let game_id = generate_game_id(caller, timestamp);
            
            // Generate card deck
            let seed = timestamp.into();
            let cards = generate_card_deck(difficulty, seed);
            
            // Create game state
            let game_state = GameStateTrait::new(
                game_id,
                caller,
                difficulty,
                cards,
                timestamp
            );
            
            // Save to world state
            set!(world, (game_state));
            
            // Emit event
            emit!(world, (GameStarted {
                game_id,
                player: caller,
                difficulty,
                timestamp
            }));
            
            game_id
        }
        
        fn flip_card(ref world: IWorldDispatcher, game_id: u32, card_index: u8) {
            let caller = get_caller_address();
            let mut game = get!(world, game_id, GameState);
            
            // Validations
            assert(game.player == caller, 'Not your game');
            assert(game.status == GameStatus::Active, 'Game not active');
            assert(game.can_flip_card(), 'Max 2 cards flipped');
            
            let cards_len: u8 = game.cards.len().try_into().unwrap();
            assert(card_index < cards_len, 'Invalid card index');
            
            let card = game.cards.at(card_index.into());
            assert(!(*card.is_flipped), 'Card already flipped');
            assert(!(*card.is_matched), 'Card already matched');
            
            // Flip the card
            let mut updated_cards = ArrayTrait::new();
            let mut i: u8 = 0;
            loop {
                if i >= cards_len {
                    break;
                }
                
                let mut current_card = *game.cards.at(i.into());
                if i == card_index {
                    current_card.is_flipped = true;
                }
                updated_cards.append(current_card);
                
                i += 1;
            };
            
            // Update flipped indices
            let mut flipped = ArrayTrait::new();
            let mut j = 0;
            loop {
                if j >= game.flipped_indices.len() {
                    break;
                }
                flipped.append(*game.flipped_indices.at(j));
                j += 1;
            };
            flipped.append(card_index);
            
            game.cards = updated_cards;
            game.flipped_indices = flipped;
            
            // Save updated game
            set!(world, (game));
            
            // Emit event
            emit!(world, (CardFlipped {
                game_id,
                card_index,
                card_value: *card.value
            }));
        }
        
        fn check_match(ref world: IWorldDispatcher, game_id: u32) -> bool {
            let caller = get_caller_address();
            let mut game = get!(world, game_id, GameState);
            
            // Validations
            assert(game.player == caller, 'Not your game');
            assert(game.status == GameStatus::Active, 'Game not active');
            assert(game.flipped_indices.len() == 2, 'Need 2 cards flipped');
            
            let idx1 = *game.flipped_indices.at(0);
            let idx2 = *game.flipped_indices.at(1);
            
            let card1 = game.cards.at(idx1.into());
            let card2 = game.cards.at(idx2.into());
            
            let is_match = *card1.value == *card2.value;
            
            // Update cards based on match result
            let mut updated_cards = ArrayTrait::new();
            let cards_len: u8 = game.cards.len().try_into().unwrap();
            let mut i: u8 = 0;
            loop {
                if i >= cards_len {
                    break;
                }
                
                let mut card = *game.cards.at(i.into());
                
                if i == idx1 || i == idx2 {
                    if is_match {
                        card.is_matched = true;
                        card.is_flipped = true;
                    } else {
                        card.is_flipped = false;
                    }
                }
                
                updated_cards.append(card);
                i += 1;
            };
            
            game.cards = updated_cards;
            game.flipped_indices = ArrayTrait::new();
            game.moves += 1;
            
            if is_match {
                game.matched_count += 1;
                
                emit!(world, (CardsMatched {
                    game_id,
                    card1_index: idx1,
                    card2_index: idx2,
                    value: *card1.value
                }));
                
                // Check win condition
                if game.is_complete() {
                    complete_game(ref world, ref game);
                }
            } else {
                emit!(world, (CardsMismatched {
                    game_id,
                    card1_index: idx1,
                    card2_index: idx2
                }));
            }
            
            // Save updated game
            set!(world, (game));
            
            is_match
        }
        
        fn get_game(world: @IWorldDispatcher, game_id: u32) -> GameState {
            get!(world, game_id, GameState)
        }
        
        fn abandon_game(ref world: IWorldDispatcher, game_id: u32) {
            let caller = get_caller_address();
            let mut game = get!(world, game_id, GameState);
            
            assert(game.player == caller, 'Not your game');
            assert(game.status == GameStatus::Active, 'Game not active');
            
            game.status = GameStatus::Abandoned;
            game.completed_at = get_block_timestamp();
            
            set!(world, (game));
        }
    }
    
    // Helper: Complete game and calculate final score
    fn complete_game(ref world: IWorldDispatcher, ref game: GameState) {
        let timestamp = get_block_timestamp();
        game.completed_at = timestamp;
        game.elapsed_time = timestamp - game.started_at;
        game.status = GameStatus::Won;
        
        // Calculate score
        game.score = calculate_score(
            game.moves,
            game.elapsed_time,
            game.difficulty
        );
        
        emit!(world, (GameCompleted {
            game_id: game.game_id,
            player: game.player,
            moves: game.moves,
            time: game.elapsed_time,
            score: game.score
        }));
    }
    
    // Helper: Generate unique game ID
    fn generate_game_id(player: ContractAddress, timestamp: u64) -> u32 {
        let hash = poseidon_hash_span(
            array![player.into(), timestamp.into(), 'MEMORABILIA_GAME'].span()
        );
        // Take lower 32 bits
        let hash_u256: u256 = hash.into();
        let result = hash_u256 & 0xFFFFFFFF;
        result.try_into().unwrap()
    }
}

