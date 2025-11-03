// Memorabilia - On-Chain Memory Game on Starknet using Dojo
// Main library file - Upgraded to Dojo 1.8.0

// Models
pub mod models {
    pub mod user_account;
    pub mod game_state;
    pub mod card;
    pub mod leaderboard;
    pub mod session_policy;
    pub mod game_cards;
    pub mod player_limits;
}

// Systems
pub mod systems {
    pub mod account_registry;
    pub mod game_system_simple;
    pub mod greeting_system;
    // mod leaderboard_system; // TODO: Upgrade to Dojo 1.8.0
    pub mod cartridge_controller;
}

// Utilities
mod utils {
    mod card_generator;
    mod random;
    mod scoring;
}

// Tests
#[cfg(test)]
mod tests {
    // mod test_game_system;
    // mod test_account_registry;
    // mod test_leaderboard;
}

