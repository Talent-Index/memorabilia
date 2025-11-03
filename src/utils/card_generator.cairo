use starknet::get_block_timestamp;use starknet::get_block_timestamp;use starknet::get_block_timestamp;

use core::poseidon::poseidon_hash_span;

use core::array::{Array, ArrayTrait};use core::poseidon::poseidon_hash_span;use core::poseidon::poseidon_hash_span;

use core::array::SpanTrait;

use core::option::OptionTrait;use core::array::{Array, ArrayTrait};use core::array::{Array, ArrayTrait};

use core::traits::Into;

use core::traits::TryInto;use core::array::SpanTrait;use core::array::SpanTrait;

use core::result::ResultTrait;

use memorabilia::models::card::{Card, CardTrait};use core::option::OptionTrait;use core::option::OptionTrait;



/// Card generation and utility functionsuse core::traits::Into;use core::traits::Into;

pub mod card_generator {

    use super::*;use core::traits::TryInto;use core::traits::TryInto;



    /// Generate shuffled card pairs based on difficultyuse core::result::ResultTrait;use core::result::ResultTrait;

    pub fn generate_card_deck(difficulty: u8) -> Array<Card> {

        let total_pairs: u8 = match difficulty {use memorabilia::models::card::{Card, CardTrait};use memorabilia::models::card::{Card, CardTrait};

            1 => 4,   // Easy: 8 cards (4 pairs)

            2 => 8,   // Medium: 16 cards (8 pairs)

            3 => 12,  // Hard: 24 cards (12 pairs)

            _ => 8,   // Default to medium#[generate_trait]/// Card generation and utility functions

        };

pub trait CardGenerator {mod card_generator {

        let mut cards = ArrayTrait::new();

        let mut position: u8 = 0;    fn generate_card_deck(difficulty: u8) -> Array<Card>;    use super::*;

        let mut value: u8 = 0;

    fn shuffle_cards(ref cards: Array<Card>, seed: felt252);pub mod card_generator_impl {

        // Create pairs

        loop {    fn validate_deck(cards: @Array<Card>) -> bool;    use super::CardGenerator;

            if value >= total_pairs {

                break;}    use super::{Card, CardTrait};

            }

    use super::{ArrayTrait, SpanTrait, OptionTrait};

            // First card of pair

            cards.append(CardTrait::new(position, value, position));/// Implementation of card generation and management functions    use super::{get_block_timestamp, poseidon_hash_span};

            position += 1;

pub struct CardGeneratorImpl;    use super::{Into, TryInto};

            // Second card of pair

            cards.append(CardTrait::new(position, value, position));

            position += 1;

impl CardGeneratorImpl of CardGenerator {    impl CardGeneratorImpl of CardGenerator {

            value += 1;

        };    fn generate_card_deck(difficulty: u8) -> Array<Card> {        /// Generate shuffled card pairs based on difficulty



        // Simple shuffle using block timestamp as seed        let total_pairs: u8 = match difficulty {        use super::*;

        let timestamp = get_block_timestamp();

        let seed = poseidon_hash_span(array![timestamp.into(), 'SHUFFLE'.into()].span());            1 => 4,   // Easy: 8 cards (4 pairs)



        shuffle_cards(ref cards, seed);            2 => 8,   // Medium: 16 cards (8 pairs)    /// Generate shuffled card pairs based on difficulty



        cards            3 => 12,  // Hard: 24 cards (12 pairs)    pub fn generate_card_deck(

    }

            _ => 8,   // Default to medium    let total_pairs: u8 = match difficulty {

    /// Shuffle an array of cards using Fisher-Yates algorithm

    fn shuffle_cards(ref cards: Array<Card>, seed: felt252) {        };        1 => 4,   // Easy: 8 cards (4 pairs)

        let mut i: u32 = cards.len() - 1;

        let mut current_seed = seed;        2 => 8,   // Medium: 16 cards (8 pairs)

        

        loop {        let mut cards = ArrayTrait::new();        3 => 12,  // Hard: 24 cards (12 pairs)

            if i == 0 {

                break;        let mut id: u8 = 0;        _ => 8,   // Default to medium

            }

                };

            // Use hash as random number generator

            current_seed = poseidon_hash_span(array![current_seed, i.into()].span());        // Create pairs

            let j: u32 = (current_seed.try_into().unwrap() % (i + 1));

                    let mut pair_idx: u8 = 0;    let mut cards = ArrayTrait::new();

            // Get cards at positions i and j

            let card_i = *cards.get(i).unwrap();        loop {    let mut id: u8 = 0;

            let card_j = *cards.get(j).unwrap();

                        if pair_idx >= total_pairs {

            // Create new array with swapped elements

            let mut new_array = ArrayTrait::new();                break;    // Create pairs

            let mut idx: u32 = 0;

                        }    let mut pair_idx: u8 = 0;

            loop {

                if idx >= cards.len() {    loop {

                    break;

                }            // First card of pair        if pair_idx >= total_pairs {

                

                if idx == i {            cards.append(CardTrait::new(id, pair_idx, id));            break;

                    new_array.append(

                        Card {             id += 1;        }

                            id: card_j.id,

                            value: card_j.value,

                            position: i.try_into().unwrap(),

                            is_flipped: false,            // Second card of pair        // First card of pair

                            is_matched: false,

                        }            cards.append(CardTrait::new(id, pair_idx, id));        cards.append(CardTrait::new(id, pair_idx, id));

                    );

                } else if idx == j {            id += 1;        id += 1;

                    new_array.append(

                        Card { 

                            id: card_i.id,

                            value: card_i.value,            pair_idx += 1;        // Second card of pair

                            position: j.try_into().unwrap(),

                            is_flipped: false,        };        cards.append(CardTrait::new(id, pair_idx, id));

                            is_matched: false,

                        }        id += 1;

                    );

                } else {        // Simple shuffle using block timestamp as seed

                    let current = *cards.get(idx).unwrap();

                    new_array.append(current);        let timestamp = get_block_timestamp();        pair_idx += 1;

                }

                        let seed = poseidon_hash_span(array![timestamp.into(), 'SHUFFLE'.into()].span());    };

                idx += 1;

            };

            

            cards = new_array;        CardGenerator::shuffle_cards(ref cards, seed);    // Simple shuffle using block timestamp as seed

            i -= 1;

        }    let timestamp = get_block_timestamp();

    }

        cards    let seed = poseidon_hash_span(array![timestamp.into(), 'SHUFFLE'.into()].span());

    /// Validate a deck of cards

    pub fn validate_deck(cards: @Array<Card>) -> bool {    }

        let len = cards.len();

            _shuffle_cards(ref cards, seed);

        // Check even number of cards

        if len % 2 != 0 {    fn shuffle_cards(ref cards: Array<Card>, seed: felt252) {

            return false;

        }        let mut i: u32 = cards.len() - 1;    cards

        

        // Check all pairs exist        let mut current_seed = seed;}

        let total_pairs: u32 = (len / 2).try_into().unwrap();

        let mut value_counts = ArrayTrait::new();        

        

        // Initialize counts array with zeros        loop {fn _shuffle_cards(ref cards: Array<Card>, seed: felt252) {

        let mut i: u32 = 0;

        loop {            if i == 0 {    let mut i: u32 = cards.len() - 1;

            if i >= total_pairs {

                break;                break;    let mut current_seed = seed;

            }

            value_counts.append(0_u8);            }    

            i += 1;

        };                loop {

        

        // Count occurrences of each pair            // Use hash as random number generator        if i == 0 {

        let mut j: u32 = 0;

        loop {            current_seed = poseidon_hash_span(array![current_seed, i.into()].span());            break;

            if j >= len {

                break;            let j: u32 = (current_seed.try_into().unwrap() % (i + 1));        }

            }

                                

            match cards.get(j) {

                Option::Some(card) => {            // Get cards at positions i and j        // Use hash as random number generator

                    let value: u32 = (*card).value.into();

                                let card_i = *cards.get(i).unwrap();        current_seed = poseidon_hash_span(array![current_seed, i.into()].span());

                    if value >= total_pairs {

                        return false; // Invalid value            let card_j = *cards.get(j).unwrap();        let j: u32 = (current_seed.try_into().unwrap() % (i + 1));

                    }

                                        

                    // Create new array with updated count

                    let mut new_counts = ArrayTrait::new();            // Create new array with swapped elements        // Create a temporary array for the swap

                    let mut k: u32 = 0;

                                let mut new_array = ArrayTrait::new();        let mut temp_array = ArrayTrait::new();

                    loop {

                        if k >= total_pairs {            let mut idx: u32 = 0;        let mut idx: u32 = 0;

                            break;

                        }                    

                        

                        match value_counts.get(k) {            loop {        loop {

                            Option::Some(count) => {

                                if k == value {                if idx >= cards.len() {            if idx >= cards.len() {

                                    new_counts.append(*count + 1_u8);

                                } else {                    break;                break;

                                    new_counts.append(*count);

                                }                }            }

                            },

                            Option::None => break,                            

                        };

                                        if idx == i {            let current_card = match cards.get(idx) {

                        k += 1;

                    };                    new_array.append(card_j);                Option::Some(card) => {

                    

                    value_counts = new_counts;                } else if idx == j {                    if idx == i {

                },

                Option::None => break,                    new_array.append(card_i);                        *cards.get(j).unwrap()

            };

                            } else {                    } else if idx == j {

            j += 1;

        };                    new_array.append(*cards.get(idx).unwrap());                        *cards.get(i).unwrap()

        

        // Verify each pair appears exactly twice                }                    } else {

        let mut k: u32 = 0;

        loop {                                        *card

            if k >= total_pairs {

                break;                idx += 1;                    }

            }

                        };                },

            match value_counts.get(k) {

                Option::Some(count) => {                            Option::None => break,

                    if *count != 2_u8 {

                        return false;            cards = new_array;            };

                    }

                },            i -= 1;            

                Option::None => return false,

            };        }            temp_array.append(current_card);

            

            k += 1;    }            idx += 1;

        };

                };

        true

    }    fn validate_deck(cards: @Array<Card>) -> bool {        

}
        let len = cards.len();        // Replace the original array with the shuffled one

                cards = temp_array;

        // Check even number of cards        

        if len % 2 != 0 {                i -= 1;

            return false;            }

        }        }

        

        // Check all pairs exist    /// Helper function to validate deck

        let total_pairs: u32 = (len / 2).try_into().unwrap();    pub fn validate_deck(cards: @Array<Card>) -> bool {

        let mut pair_counts = ArrayTrait::new();        let len = cards.len();

                

        // Initialize counts array with zeros        // Check even number of cards

        let mut i: u32 = 0;        if len % 2 != 0 {

        loop {            return false;

            if i >= total_pairs {        }

                break;        

            }        // Check all pairs exist

            pair_counts.append(0_u8);        let total_pairs: u32 = (len / 2).try_into().unwrap();

            i += 1;        let mut pair_counts = ArrayTrait::new();

        };        

                // Initialize counts array with zeros

        // Count occurrences of each pair        let mut i: u32 = 0;

        let mut j: u32 = 0;        loop {

        loop {            if i >= total_pairs {

            if j >= len {                break;

                break;            }

            }            pair_counts.append(0_u8);

                        i += 1;

            match cards.get(j) {        };

                Option::Some(card) => {    

                    let pair_idx: u32 = (*card).pair_idx.into();        // Count occurrences of each pair

                            let mut j: u32 = 0;

                    if pair_idx >= total_pairs {        loop {

                        return false; // Invalid pair index            if j >= len {

                    }                break;

                                }

                    // Create new array with updated count            

                    let mut new_counts = ArrayTrait::new();            let card = match cards.get(j) {

                    let mut k: u32 = 0;                Option::Some(card) => card,

                                    Option::None => break,

                    loop {            };

                        if k >= total_pairs {            

                            break;            let pair_idx: u32 = (*card).pair_idx.into();

                        }            

                                    if pair_idx >= total_pairs {

                        match pair_counts.get(k) {                return false; // Invalid pair index

                            Option::Some(count) => {            }

                                if k == pair_idx {            

                                    new_counts.append(*count + 1_u8);            // Create new array with updated count

                                } else {            let mut new_counts = ArrayTrait::new();

                                    new_counts.append(*count);            let mut k: u32 = 0;

                                }            

                            },            loop {

                            Option::None => break,                if k >= total_pairs {

                        };                    break;

                                        }

                        k += 1;                

                    };                let current_count = match pair_counts.get(k) {

                                        Option::Some(count) => {

                    pair_counts = new_counts;                        if k == pair_idx {

                },                            *count + 1_u8

                Option::None => break,                        } else {

            };                            *count

                                    }

            j += 1;                    },

        };                    Option::None => break,

                        };

        // Verify each pair appears exactly twice                

        let mut k: u32 = 0;                new_counts.append(current_count);

        loop {                k += 1;

            if k >= total_pairs {            };

                break;            

            }            pair_counts = new_counts;

                        j += 1;

            match pair_counts.get(k) {        };

                Option::Some(count) => {        

                    if *count != 2_u8 {        // Verify each pair appears exactly twice

                        return false;        let mut k: u32 = 0;

                    }        loop {

                },            if k >= total_pairs {

                Option::None => return false,                break;

            };            }

                        

            k += 1;            match pair_counts.get(k) {

        };                Option::Some(count) => {

                            if *count != 2_u8 {

        true                        return false;

    }                    }

}                },
                Option::None => return false,
            };
            
            k += 1;
        };
        
        true
    }
}

// Re-export public functions
pub use card_generator::{generate_card_deck, validate_deck};

