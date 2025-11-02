#[cfg(test)]
mod tests {
    use starknet::ContractAddress;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    
    use memorabilia::models::game_state::{GameState, GameStatus, game_state};
    use memorabilia::models::card::{Card, card};
    use memorabilia::systems::game_system::{
        game_system, IGameSystemDispatcher, IGameSystemDispatcherTrait
    };
    
    fn setup() -> (IWorldDispatcher, IGameSystemDispatcher) {
        // Spawn test world
        let mut models = array![game_state::TEST_CLASS_HASH, card::TEST_CLASS_HASH];
        let world = spawn_test_world(models);
        
        // Deploy game system
        let contract_address = world.deploy_contract('salt', game_system::TEST_CLASS_HASH);
        let game_system = IGameSystemDispatcher { contract_address };
        
        (world, game_system)
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_start_game_easy() {
        let (world, game_system) = setup();
        
        // Start easy game
        let game_id = game_system.start_game(1);
        
        // Verify game was created
        let game = game_system.get_game(game_id);
        assert(game.difficulty == 1, 'Wrong difficulty');
        assert(game.cards.len() == 8, 'Wrong card count');
        assert(game.status == GameStatus::Active, 'Game not active');
        assert(game.total_pairs == 4, 'Wrong pair count');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_start_game_medium() {
        let (world, game_system) = setup();
        
        let game_id = game_system.start_game(2);
        let game = game_system.get_game(game_id);
        
        assert(game.difficulty == 2, 'Wrong difficulty');
        assert(game.cards.len() == 16, 'Wrong card count');
        assert(game.total_pairs == 8, 'Wrong pair count');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_start_game_hard() {
        let (world, game_system) = setup();
        
        let game_id = game_system.start_game(3);
        let game = game_system.get_game(game_id);
        
        assert(game.difficulty == 3, 'Wrong difficulty');
        assert(game.cards.len() == 24, 'Wrong card count');
        assert(game.total_pairs == 12, 'Wrong pair count');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_flip_card() {
        let (world, game_system) = setup();
        
        let game_id = game_system.start_game(1);
        
        // Flip first card
        game_system.flip_card(game_id, 0);
        
        let game = game_system.get_game(game_id);
        assert(game.flipped_indices.len() == 1, 'Card not flipped');
        
        let card = game.cards.at(0);
        assert(*card.is_flipped, 'Card should be flipped');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_flip_two_cards() {
        let (world, game_system) = setup();
        
        let game_id = game_system.start_game(1);
        
        // Flip two cards
        game_system.flip_card(game_id, 0);
        game_system.flip_card(game_id, 1);
        
        let game = game_system.get_game(game_id);
        assert(game.flipped_indices.len() == 2, 'Should have 2 flipped');
    }
    
    #[test]
    #[available_gas(30000000)]
    #[should_panic(expected: ('Max 2 cards flipped',))]
    fn test_cannot_flip_three_cards() {
        let (world, game_system) = setup();
        
        let game_id = game_system.start_game(1);
        
        // Try to flip three cards
        game_system.flip_card(game_id, 0);
        game_system.flip_card(game_id, 1);
        game_system.flip_card(game_id, 2); // Should panic
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_check_match_success() {
        let (world, game_system) = setup();
        
        let game_id = game_system.start_game(1);
        let game = game_system.get_game(game_id);
        
        // Find two cards with same value
        let mut first_idx = 0_u8;
        let mut second_idx = 0_u8;
        let first_value = *game.cards.at(0).value;
        
        let mut i = 1_u8;
        loop {
            if i >= 8 {
                break;
            }
            
            let card = game.cards.at(i.into());
            if *card.value == first_value {
                second_idx = i;
                break;
            }
            
            i += 1;
        };
        
        // Flip matching cards
        game_system.flip_card(game_id, first_idx);
        game_system.flip_card(game_id, second_idx);
        
        // Check match
        let is_match = game_system.check_match(game_id);
        assert(is_match, 'Should be a match');
        
        let game = game_system.get_game(game_id);
        assert(game.matched_count == 1, 'Match count wrong');
        assert(game.moves == 1, 'Move count wrong');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_abandon_game() {
        let (world, game_system) = setup();
        
        let game_id = game_system.start_game(1);
        game_system.abandon_game(game_id);
        
        let game = game_system.get_game(game_id);
        assert(game.status == GameStatus::Abandoned, 'Game not abandoned');
    }
}

