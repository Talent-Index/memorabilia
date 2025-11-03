use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
pub enum GameStatus {
    #[default]
    Active = 0,
    Won = 1,
    Abandoned = 2,
}

impl GameStatusIntoFelt252 of Into<GameStatus, felt252> {
    fn into(self: GameStatus) -> felt252 {
        match self {
            GameStatus::Active => 0,
            GameStatus::Won => 1,
            GameStatus::Abandoned => 2,
        }
    }
}

impl Felt252TryIntoGameStatus of TryInto<felt252, GameStatus> {
    fn try_into(self: felt252) -> Option<GameStatus> {
        if self == 0 {
            Option::Some(GameStatus::Active)
        } else if self == 1 {
            Option::Some(GameStatus::Won)
        } else if self == 2 {
            Option::Some(GameStatus::Abandoned)
        } else {
            Option::None
        }
    }
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct GameState {
    #[key]
    pub game_id: u32,
    pub player: ContractAddress,
    pub difficulty: u8,          // 1=Easy(8 cards), 2=Medium(16), 3=Hard(24)
    pub total_cards: u8,         // Total number of cards
    pub flipped_card_1: u8,      // First flipped card index (255 = none)
    pub flipped_card_2: u8,      // Second flipped card index (255 = none)
    pub matched_count: u8,       // Number of pairs matched
    pub total_pairs: u8,         // Total pairs in game
    pub moves: u32,              // Number of moves made
    pub score: u32,              // Calculated score
    pub started_at: u64,         // Game start timestamp
    pub completed_at: u64,       // Game completion (0 if ongoing)
    pub status: GameStatus,      // Active, Won, Abandoned
    pub elapsed_time: u64,       // Time taken (seconds)
}

#[generate_trait]
pub impl GameStateImpl of GameStateTrait {
    fn new(
        game_id: u32,
        player: ContractAddress,
        difficulty: u8,
        started_at: u64
    ) -> GameState {
        let total_pairs = match difficulty {
            1 => 4_u8,
            2 => 8_u8,
            3 => 12_u8,
            _ => 8_u8,
        };

        let total_cards = total_pairs * 2;

        GameState {
            game_id,
            player,
            difficulty,
            total_cards,
            flipped_card_1: 255,  // 255 means no card flipped
            flipped_card_2: 255,
            matched_count: 0,
            total_pairs,
            moves: 0,
            score: 0,
            started_at,
            completed_at: 0,
            status: GameStatus::Active,
            elapsed_time: 0,
        }
    }

    fn is_complete(self: @GameState) -> bool {
        *self.matched_count == *self.total_pairs
    }

    fn can_flip_card(self: @GameState) -> bool {
        *self.flipped_card_1 == 255 || *self.flipped_card_2 == 255
    }

    fn has_two_flipped(self: @GameState) -> bool {
        *self.flipped_card_1 != 255 && *self.flipped_card_2 != 255
    }
}

