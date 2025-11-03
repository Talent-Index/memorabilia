// Simplified Game System for Dojo 1.8.0
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use memorabilia::models::game_state::{GameState, GameStatus, GameStateTrait};
use memorabilia::models::game_cards::{GameCards, GameCardsTrait};
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
pub struct GameCompleted {
    #[key]
    pub game_id: u32,
    pub player: ContractAddress,
    pub moves: u32,
    pub time: u64,
    pub score: u32,
}

#[starknet::interface]
trait IGameSystem<T> {
    fn start_game(ref self: T, difficulty: u8) -> u32;
    fn flip_card(ref self: T, game_id: u32, card_index: u8);
    fn get_game(self: @T, game_id: u32) -> GameState;
}

#[dojo::contract]
mod game_system {
    use super::{
        GameState, GameStatus, GameStateTrait, GameCards, GameCardsTrait,
        generate_card_deck,
        GameStarted, CardFlipped, GameCompleted,
        IGameSystem
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use core::poseidon::PoseidonTrait;
    use core::hash::{HashStateTrait};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
    use dojo::world::WorldStorage;
    
    #[abi(embed_v0)]
    impl GameSystemImpl of IGameSystem<ContractState> {
        fn start_game(ref self: ContractState, difficulty: u8) -> u32 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Validate difficulty
            assert(difficulty >= 1 && difficulty <= 3, 'Invalid difficulty');
            
            // Generate unique game_id
            let game_id = generate_game_id(caller, timestamp);
            
            // Generate card deck
            let cards = generate_card_deck(difficulty, timestamp);
            
            // Create game state
            let game_state = GameStateTrait::new(
                game_id,
                caller,
                difficulty,
                timestamp
            );
            
            // Save game state
            world.write_model(@game_state);
            
            // Save cards
            let mut i: u32 = 0;
            let cards_len = cards.len();
            loop {
                if i >= cards_len {
                    break;
                }
                let card = cards.at(i);
                let game_card = GameCardsTrait::new(
                    game_id,
                    i.try_into().unwrap(),
                    *card.value,
                    *card.position
                );
                world.write_model(@game_card);
                i += 1;
            };
            
            // Emit event
            world.emit_event(@GameStarted {
                game_id,
                player: caller,
                difficulty,
                timestamp
            });
            
            game_id
        }
        
        fn flip_card(ref self: ContractState, game_id: u32, card_index: u8) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            
            // Get game state
            let mut game: GameState = world.read_model(game_id);
            assert(game.player == caller, 'Not your game');
            assert(game.status == GameStatus::Active, 'Game not active');
            
            // Get card
            let mut card: GameCards = world.read_model((game_id, card_index));
            assert(!card.is_matched, 'Card already matched');
            
            // Flip the card
            card.is_flipped = !card.is_flipped;
            world.write_model(@card);
            
            // Emit event
            world.emit_event(@CardFlipped {
                game_id,
                card_index,
                card_value: card.value
            });
        }
        
        fn get_game(self: @ContractState, game_id: u32) -> GameState {
            let world = self.world_default();
            world.read_model(game_id)
        }
    }
    
    // Helper function to generate unique game ID
    fn generate_game_id(player: ContractAddress, timestamp: u64) -> u32 {
        let hash = PoseidonTrait::new()
            .update(player.into())
            .update(timestamp.into())
            .update('GAME')
            .finalize();

        // Convert to u32 by taking lower bits
        let game_id: u32 = (hash.try_into().unwrap());
        game_id
    }
}

