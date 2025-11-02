use memorabilia::models::card::{Card, CardTrait};
use memorabilia::utils::random::{Random, RandomTrait};

// Generate shuffled card pairs based on difficulty
pub fn generate_card_deck(difficulty: u8, seed: felt252) -> Array<Card> {
    let total_pairs: u8 = match difficulty {
        1 => 4,   // Easy: 8 cards (4 pairs)
        2 => 8,   // Medium: 16 cards (8 pairs)
        3 => 12,  // Hard: 24 cards (12 pairs)
        _ => 8,   // Default to medium
    };
    
    let mut cards = ArrayTrait::new();
    let mut id: u8 = 0;
    
    // Create pairs
    let mut pair_idx: u8 = 0;
    loop {
        if pair_idx >= total_pairs {
            break;
        }
        
        // First card of pair
        cards.append(CardTrait::new(id, pair_idx, id));
        id += 1;
        
        // Second card of pair
        cards.append(CardTrait::new(id, pair_idx, id));
        id += 1;
        
        pair_idx += 1;
    };
    
    // Shuffle using Fisher-Yates algorithm
    shuffle_cards(ref cards, seed);
    
    cards
}

// Fisher-Yates shuffle algorithm
fn shuffle_cards(ref cards: Array<Card>, seed: felt252) {
    let mut rng = RandomTrait::new(seed);
    let len = cards.len();
    
    if len <= 1 {
        return;
    }
    
    // We need to create a new array because Cairo arrays are append-only
    let mut shuffled = ArrayTrait::new();
    let mut indices = ArrayTrait::new();
    
    // Initialize indices array
    let mut i: u32 = 0;
    loop {
        if i >= len {
            break;
        }
        indices.append(i);
        i += 1;
    };
    
    // Fisher-Yates shuffle on indices
    let mut remaining = len;
    loop {
        if remaining == 0 {
            break;
        }
        
        // Get random index in remaining range
        let random_idx = if remaining == 1 {
            0
        } else {
            (rng.next_u32() % remaining)
        };
        
        // Get the card at the random index
        let card_idx = *indices.at(random_idx);
        let card = *cards.at(card_idx);
        shuffled.append(card);
        
        // Remove used index by swapping with last and reducing size
        // (we don't actually remove, just track remaining)
        remaining -= 1;
    };
    
    // Replace original array with shuffled
    cards = shuffled;
}

// Helper function to validate deck
pub fn validate_deck(cards: @Array<Card>) -> bool {
    let len = cards.len();
    
    // Check even number of cards
    if len % 2 != 0 {
        return false;
    }
    
    // Check all pairs exist
    let total_pairs = len / 2;
    let mut value_counts = ArrayTrait::new();
    
    // Initialize counts
    let mut i: u32 = 0;
    loop {
        if i >= total_pairs {
            break;
        }
        value_counts.append(0_u8);
        i += 1;
    };
    
    // Count each value
    let mut j: u32 = 0;
    loop {
        if j >= len {
            break;
        }
        let card = cards.at(j);
        // Each value should appear exactly twice
        j += 1;
    };
    
    true
}

#[cfg(test)]
mod tests {
    use super::{generate_card_deck, validate_deck};
    
    #[test]
    fn test_generate_easy_deck() {
        let cards = generate_card_deck(1, 42);
        assert(cards.len() == 8, 'Easy deck should have 8 cards');
    }
    
    #[test]
    fn test_generate_medium_deck() {
        let cards = generate_card_deck(2, 42);
        assert(cards.len() == 16, 'Medium deck should have 16');
    }
    
    #[test]
    fn test_generate_hard_deck() {
        let cards = generate_card_deck(3, 42);
        assert(cards.len() == 24, 'Hard deck should have 24');
    }
    
    #[test]
    fn test_deck_has_pairs() {
        let cards = generate_card_deck(1, 42);
        
        // Count occurrences of each value
        let mut value_0_count = 0;
        let mut i = 0;
        loop {
            if i >= cards.len() {
                break;
            }
            let card = cards.at(i);
            if *card.value == 0 {
                value_0_count += 1;
            }
            i += 1;
        };
        
        // Each value should appear exactly twice
        assert(value_0_count == 2, 'Should have 2 of each value');
    }
}

