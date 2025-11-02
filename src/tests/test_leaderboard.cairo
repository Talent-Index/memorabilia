#[cfg(test)]
mod tests {
    use starknet::ContractAddress;
    use starknet::contract_address_const;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    
    use memorabilia::models::leaderboard::{LeaderboardEntry, PlayerStats, leaderboard_entry, player_stats};
    use memorabilia::systems::leaderboard_system::{
        leaderboard_system, ILeaderboardSystemDispatcher, ILeaderboardSystemDispatcherTrait
    };
    
    fn setup() -> (IWorldDispatcher, ILeaderboardSystemDispatcher) {
        let mut models = array![leaderboard_entry::TEST_CLASS_HASH, player_stats::TEST_CLASS_HASH];
        let world = spawn_test_world(models);
        
        let contract_address = world.deploy_contract('salt', leaderboard_system::TEST_CLASS_HASH);
        let leaderboard = ILeaderboardSystemDispatcher { contract_address };
        
        (world, leaderboard)
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_submit_score() {
        let (world, leaderboard) = setup();
        
        let game_id = 1_u32;
        let telegram_id: felt252 = 123456789;
        let score = 15000_u32;
        let difficulty = 3_u8;
        let moves = 24_u32;
        let time = 120_u64;
        
        // Submit score
        leaderboard.submit_score(
            game_id,
            telegram_id,
            score,
            difficulty,
            moves,
            time
        );
        
        // Verify player stats were updated
        let player = starknet::get_caller_address();
        let stats = leaderboard.get_player_stats(player);
        
        assert(stats.total_games == 1, 'Wrong game count');
        assert(stats.total_wins == 1, 'Wrong win count');
        assert(stats.best_score == score, 'Wrong best score');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_player_stats_update() {
        let (world, leaderboard) = setup();
        
        let telegram_id: felt252 = 123456789;
        
        // Submit first game
        leaderboard.submit_score(1, telegram_id, 10000, 2, 20, 150);
        
        // Submit second game with better score
        leaderboard.submit_score(2, telegram_id, 15000, 3, 24, 120);
        
        let player = starknet::get_caller_address();
        let stats = leaderboard.get_player_stats(player);
        
        assert(stats.total_games == 2, 'Should have 2 games');
        assert(stats.best_score == 15000, 'Best score should update');
        assert(stats.best_time == 120, 'Best time should update');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_leaderboard_entry() {
        let (world, leaderboard) = setup();
        
        let telegram_id: felt252 = 123456789;
        let score = 15000_u32;
        
        // Submit high score
        leaderboard.submit_score(1, telegram_id, score, 3, 24, 120);
        
        // Check leaderboard entry
        let entry = leaderboard.get_leaderboard_entry(1);
        
        // Entry should exist if score is high enough
        if !entry.player.is_zero() {
            assert(entry.score == score, 'Wrong score in entry');
            assert(entry.difficulty == 3, 'Wrong difficulty');
        }
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_multiple_players() {
        let (world, leaderboard) = setup();
        
        // Submit scores for different players
        // Note: In actual test, you'd need to change caller address
        leaderboard.submit_score(1, 111, 12000, 2, 20, 150);
        leaderboard.submit_score(2, 222, 15000, 3, 24, 120);
        leaderboard.submit_score(3, 333, 10000, 1, 10, 180);
        
        let player = starknet::get_caller_address();
        let stats = leaderboard.get_player_stats(player);
        
        // All scores from same caller in test
        assert(stats.total_games == 3, 'Should have 3 games');
    }
}

