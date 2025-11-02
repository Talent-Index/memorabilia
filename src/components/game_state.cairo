use starknet::ContractAddress;

#[component]
struct GameState {
    #[key]
    game_id: u32,
    #[key]
    player: ContractAddress,
    status: u8,    // 0: not started, 1: in progress, 2: completed
    score: u32,
    moves: u32,
    timestamp: u64
}

#[component]
struct Card {
    #[key]
    game_id: u32,
    #[key]
    card_index: u32,
    value: felt252,
    is_flipped: bool,
    is_matched: bool
}

#[component]
struct FlippedCards {
    #[key]
    game_id: u32,
    first_card: Option<u32>,
    second_card: Option<u32>
}