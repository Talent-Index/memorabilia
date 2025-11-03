// Card is now a simple struct, not a model
// Cards are stored using the GameCards model
#[derive(Copy, Drop, Serde, Introspect)]
pub struct Card {
    pub id: u8,              // 0-23 (for 12 pairs)
    pub value: u8,           // 0-11 (12 unique values)
    pub is_flipped: bool,    // Current flip state
    pub is_matched: bool,    // Permanently matched
    pub position: u8,        // Position in grid (0-23)
}

#[generate_trait]
pub impl CardImpl of CardTrait {
    fn new(id: u8, value: u8, position: u8) -> Card {
        Card {
            id,
            value,
            is_flipped: false,
            is_matched: false,
            position,
        }
    }
    
    fn flip(ref self: Card) {
        assert(!self.is_matched, 'Card already matched');
        self.is_flipped = !self.is_flipped;
    }
    
    fn mark_matched(ref self: Card) {
        self.is_matched = true;
        self.is_flipped = true;
    }
    
    fn reset_flip(ref self: Card) {
        if !self.is_matched {
            self.is_flipped = false;
        }
    }
}

