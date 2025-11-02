// Memorabilia - On-Chain Memory Game on Starknet using Dojo
// Main library file

// Models
mod models {
    mod user_account;
    mod game_state;
    mod card;
    mod leaderboard;
    mod session_policy;
}

// Systems
mod systems {
    mod account_registry;
    mod game_system;
    mod greeting_system;
    mod leaderboard_system;
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
    mod test_game_system;
    mod test_account_registry;
    mod test_leaderboard;
}

