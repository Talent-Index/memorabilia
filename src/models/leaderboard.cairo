use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct LeaderboardEntry {
    #[key]
    pub rank: u32,
    pub player: ContractAddress,
    pub telegram_id: felt252,
    pub score: u32,
    pub difficulty: u8,
    pub moves: u32,
    pub time: u64,
    pub game_id: u32,
    pub achieved_at: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct PlayerStats {
    #[key]
    pub player: ContractAddress,
    pub total_games: u32,
    pub total_wins: u32,
    pub best_score: u32,
    pub best_time: u64,
    pub total_moves: u32,
    pub average_score: u32,
    pub games_by_difficulty: (u32, u32, u32), // (easy, medium, hard)
}

#[generate_trait]
pub impl LeaderboardEntryImpl of LeaderboardEntryTrait {
    fn new(
        rank: u32,
        player: ContractAddress,
        telegram_id: felt252,
        score: u32,
        difficulty: u8,
        moves: u32,
        time: u64,
        game_id: u32,
        achieved_at: u64
    ) -> LeaderboardEntry {
        LeaderboardEntry {
            rank,
            player,
            telegram_id,
            score,
            difficulty,
            moves,
            time,
            game_id,
            achieved_at,
        }
    }
}

#[generate_trait]
pub impl PlayerStatsImpl of PlayerStatsTrait {
    fn new(player: ContractAddress) -> PlayerStats {
        PlayerStats {
            player,
            total_games: 0,
            total_wins: 0,
            best_score: 0,
            best_time: 0,
            total_moves: 0,
            average_score: 0,
            games_by_difficulty: (0, 0, 0),
        }
    }
    
    fn update_with_game(
        ref self: PlayerStats,
        score: u32,
        time: u64,
        moves: u32,
        difficulty: u8
    ) {
        self.total_games += 1;
        self.total_wins += 1;
        self.total_moves += moves;
        
        // Update best score
        if score > self.best_score {
            self.best_score = score;
        }
        
        // Update best time (lower is better, 0 means not set)
        if self.best_time == 0 || time < self.best_time {
            self.best_time = time;
        }
        
        // Update average score
        self.average_score = (self.average_score * (self.total_games - 1) + score) / self.total_games;
        
        // Update difficulty counts
        let (mut easy, mut medium, mut hard) = self.games_by_difficulty;
        match difficulty {
            1 => easy += 1,
            2 => medium += 1,
            3 => hard += 1,
            _ => {},
        };
        self.games_by_difficulty = (easy, medium, hard);
    }
}

