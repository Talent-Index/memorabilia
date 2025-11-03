#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct GameCards {
    #[key]
    pub game_id: u32,
    #[key]
    pub index: u8,
    pub value: u8,
    pub is_flipped: bool,
    pub is_matched: bool,
    pub position: u8,
}

#[generate_trait]
pub impl GameCardsImpl of GameCardsTrait {
    fn new(game_id: u32, index: u8, value: u8, position: u8) -> GameCards {
        GameCards {
            game_id,
            index,
            value,
            is_flipped: false,
            is_matched: false,
            position,
        }
    }
}