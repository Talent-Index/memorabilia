use starknet::ContractAddress;
use memorabilia::models::card::Card;

#[derive(Copy, Drop, Serde, Introspect, PartialEq)]
pub enum GameStatus {
    Active,
    Won,
    Abandoned,
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct GameState {
    #[key]
    pub game_id: u32,
    pub player: ContractAddress,
    pub difficulty: u8,          // 1=Easy(8 cards), 2=Medium(16), 3=Hard(24)
    pub cards: Array<Card>,       // Array of cards
    pub flipped_indices: Array<u8>, // Currently flipped (max 2)
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
        cards: Array<Card>,
        started_at: u64
    ) -> GameState {
        let total_pairs = match difficulty {
            1 => 4_u8,
            2 => 8_u8,
            3 => 12_u8,
            _ => 8_u8,
        };
        
        GameState {
            game_id,
            player,
            difficulty,
            cards,
            flipped_indices: array![],
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
        self.flipped_indices.len() < 2
    }
}

