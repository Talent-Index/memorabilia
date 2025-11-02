use starknet::ContractAddress;
use memorabilia::models::leaderboard::{LeaderboardEntry, PlayerStats, LeaderboardEntryTrait, PlayerStatsTrait};

#[derive(Drop, Serde)]
#[dojo::event]
pub struct LeaderboardUpdated {
    #[key]
    pub player: ContractAddress,
    pub new_rank: u32,
    pub score: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct PlayerStatsUpdated {
    #[key]
    pub player: ContractAddress,
    pub total_games: u32,
    pub best_score: u32,
}

#[dojo::interface]
trait ILeaderboardSystem {
    fn submit_score(
        ref world: IWorldDispatcher,
        game_id: u32,
        telegram_id: felt252,
        score: u32,
        difficulty: u8,
        moves: u32,
        time: u64
    );
    
    fn get_leaderboard_entry(
        world: @IWorldDispatcher,
        rank: u32
    ) -> LeaderboardEntry;
    
    fn get_player_stats(
        world: @IWorldDispatcher,
        player: ContractAddress
    ) -> PlayerStats;
    
    fn get_player_rank(
        world: @IWorldDispatcher,
        player: ContractAddress
    ) -> u32;
}

#[dojo::contract]
mod leaderboard_system {
    use super::{
        LeaderboardEntry, PlayerStats, LeaderboardEntryTrait, PlayerStatsTrait,
        LeaderboardUpdated, PlayerStatsUpdated, ILeaderboardSystem
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    
    #[abi(embed_v0)]
    impl LeaderboardSystemImpl of ILeaderboardSystem<ContractState> {
        fn submit_score(
            ref world: IWorldDispatcher,
            game_id: u32,
            telegram_id: felt252,
            score: u32,
            difficulty: u8,
            moves: u32,
            time: u64
        ) {
            let player = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Update player stats
            let mut stats = get!(world, player, PlayerStats);
            
            // Initialize if new player
            if stats.player.is_zero() {
                stats = PlayerStatsTrait::new(player);
            }
            
            // Update stats with new game
            stats.update_with_game(score, time, moves, difficulty);
            set!(world, (stats));
            
            // Emit stats update event
            emit!(world, (PlayerStatsUpdated {
                player,
                total_games: stats.total_games,
                best_score: stats.best_score
            }));
            
            // Check if score qualifies for leaderboard
            // For simplicity, we'll store top scores by rank
            // In production, you'd want a more sophisticated ranking system
            
            let rank = calculate_rank(world, score);
            
            if rank > 0 && rank <= 100 { // Top 100
                let entry = LeaderboardEntryTrait::new(
                    rank,
                    player,
                    telegram_id,
                    score,
                    difficulty,
                    moves,
                    time,
                    game_id,
                    timestamp
                );
                
                set!(world, (entry));
                
                emit!(world, (LeaderboardUpdated {
                    player,
                    new_rank: rank,
                    score
                }));
            }
        }
        
        fn get_leaderboard_entry(
            world: @IWorldDispatcher,
            rank: u32
        ) -> LeaderboardEntry {
            get!(world, rank, LeaderboardEntry)
        }
        
        fn get_player_stats(
            world: @IWorldDispatcher,
            player: ContractAddress
        ) -> PlayerStats {
            get!(world, player, PlayerStats)
        }
        
        fn get_player_rank(
            world: @IWorldDispatcher,
            player: ContractAddress
        ) -> u32 {
            // Search through leaderboard to find player's rank
            // In production, you'd want to index this differently
            let mut rank = 1_u32;
            loop {
                if rank > 100 {
                    break 0; // Not in top 100
                }
                
                let entry = get!(world, rank, LeaderboardEntry);
                if entry.player == player {
                    break rank;
                }
                
                rank += 1;
            }
        }
    }
    
    // Helper: Calculate rank for a new score
    // This is a simplified version - production would need better ranking logic
    fn calculate_rank(world: @IWorldDispatcher, new_score: u32) -> u32 {
        let mut rank = 1_u32;
        let mut insert_rank = 101_u32; // Default: not in top 100
        
        loop {
            if rank > 100 {
                break;
            }
            
            let entry = get!(world, rank, LeaderboardEntry);
            
            // If slot is empty or new score is better
            if entry.player.is_zero() || new_score > entry.score {
                insert_rank = rank;
                break;
            }
            
            rank += 1;
        };
        
        insert_rank
    }
}

