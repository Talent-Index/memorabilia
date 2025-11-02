use core::poseidon::poseidon_hash_span;

// Simple LCG (Linear Congruential Generator) for card shuffling
#[derive(Copy, Drop)]
pub struct Random {
    pub state: felt252,
}

#[generate_trait]
pub impl RandomImpl of RandomTrait {
    fn new(seed: felt252) -> Random {
        let initial_state = if seed == 0 {
            // Use a default seed if none provided
            123456789
        } else {
            seed
        };
        Random { state: initial_state }
    }
    
    fn next(ref self: Random) -> felt252 {
        // LCG parameters (from Numerical Recipes)
        // Using Poseidon hash for better randomness on Starknet
        let hash_input = array![self.state, 1664525, 1013904223];
        self.state = poseidon_hash_span(hash_input.span());
        self.state
    }
    
    fn next_u8(ref self: Random) -> u8 {
        let random_felt = self.next();
        // Convert felt252 to u8 by taking modulo
        let value: u256 = random_felt.into();
        let result = value % 256;
        result.try_into().unwrap()
    }
    
    fn next_u32(ref self: Random) -> u32 {
        let random_felt = self.next();
        let value: u256 = random_felt.into();
        let result = value % 0x100000000; // 2^32
        result.try_into().unwrap()
    }
    
    fn next_in_range(ref self: Random, min: u64, max: u64) -> u64 {
        assert(max > min, 'Invalid range');
        let range = max - min;
        let random_felt = self.next();
        let value: u256 = random_felt.into();
        let result = value % range.into();
        min + result.try_into().unwrap()
    }
    
    fn next_u8_in_range(ref self: Random, min: u8, max: u8) -> u8 {
        assert(max > min, 'Invalid range');
        let range = max - min;
        let random = self.next_u8();
        min + (random % range)
    }
}

#[cfg(test)]
mod tests {
    use super::{Random, RandomTrait};
    
    #[test]
    fn test_random_generation() {
        let mut rng = RandomTrait::new(42);
        let val1 = rng.next_u8();
        let val2 = rng.next_u8();
        
        // Values should be different
        assert(val1 != val2, 'Values should differ');
    }
    
    #[test]
    fn test_random_range() {
        let mut rng = RandomTrait::new(42);
        let val = rng.next_u8_in_range(0, 10);
        
        assert(val < 10, 'Value out of range');
    }
}

