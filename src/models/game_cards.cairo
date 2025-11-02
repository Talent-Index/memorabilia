use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
pub struct GameCards {
    #[key]
    pub game_id: u32,
    #[key]
    pub index: u8,
    pub value: u8,
    pub is_flipped: bool,
    pub is_matched: bool
}

#[generate_trait]
pub impl GameCardsImpl of GameCardsTrait {
    fn new(game_id: u32, index: u8, value: u8) -> GameCards {
        GameCards {
            game_id,
            index,
            value,
            is_flipped: false,
            is_matched: false
        }
    }

    fn get_cards_for_game(world: IWorldDispatcher, game_id: u32) -> Array<Card> {
        let mut cards = ArrayTrait::new();
        let mut i: u8 = 0;
        
        loop {
            match get!(world, (game_id, i), GameCards) {
                Option::Some(card) => {
                    cards.append(Card {
                        id: i,
                        value: card.value,
                        is_flipped: card.is_flipped,
                        is_matched: card.is_matched
                    });
                    i += 1;
                },
                Option::None => break,
            }
        };
        
        cards
    }

    fn save_cards(ref world: IWorldDispatcher, game_id: u32, cards: Array<Card>) {
        let mut i: u8 = 0;
        
        loop {
            if i >= cards.len() {
                break;
            }
            
            let card = cards.at(i);
            set!(world, (GameCards {
                game_id,
                index: i,
                value: *card.value,
                is_flipped: *card.is_flipped,
                is_matched: *card.is_matched
            }));
            
            i += 1;
        }
    }
}