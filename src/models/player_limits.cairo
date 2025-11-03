use starknet::ContractAddress;

const MAX_GAMES_PER_DAY: u32 = 100;
const MIN_GAME_INTERVAL: u64 = 30; // 30 seconds between games

#[derive(Drop, Serde)]
#[dojo::model]
pub struct PlayerLimits {
    #[key]
    pub player: ContractAddress,
    pub last_game_timestamp: u64,
    pub games_today: u32,
    pub last_daily_reset: u64
}

#[generate_trait]
pub impl PlayerLimitsImpl of PlayerLimitsTrait {
    fn new(player: ContractAddress, timestamp: u64) -> PlayerLimits {
        PlayerLimits {
            player,
            last_game_timestamp: timestamp,
            games_today: 1,
            last_daily_reset: timestamp
        }
    }

    fn can_start_game(self: @PlayerLimits, current_time: u64) -> bool {
        // Check cooldown period
        if (current_time - *self.last_game_timestamp) < MIN_GAME_INTERVAL {
            return false;
        }

        // Check if we need to reset daily counter
        if (current_time - *self.last_daily_reset) >= 86400 { // 24 hours
            return true; // Will reset counter in start_game
        }

        // Check daily limit
        let games = *self.games_today;
        games < MAX_GAMES_PER_DAY
    }

    fn update_limits(ref self: PlayerLimits, current_time: u64) {
        // Reset daily counter if 24 hours passed
        if current_time - self.last_daily_reset >= 86400 {
            self.games_today = 1;
            self.last_daily_reset = current_time;
        } else {
            self.games_today += 1;
        }
        self.last_game_timestamp = current_time;
    }
}