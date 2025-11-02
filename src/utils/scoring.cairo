// Calculate score based on performance
// Better score = fewer moves + faster time + higher difficulty

pub fn calculate_score(moves: u32, time_seconds: u64, difficulty: u8) -> u32 {
    let base_score: u32 = 10000;
    
    // Difficulty multiplier
    let difficulty_multiplier: u32 = match difficulty {
        1 => 10,  // Easy
        2 => 15,  // Medium
        3 => 20,  // Hard
        _ => 15,
    };
    
    // Calculate optimal moves for difficulty
    let optimal_moves: u32 = match difficulty {
        1 => 8,   // 4 pairs = 8 perfect moves
        2 => 16,  // 8 pairs = 16 perfect moves
        3 => 24,  // 12 pairs = 24 perfect moves
        _ => 16,
    };
    
    // Penalty for extra moves (10 points per extra move)
    let move_penalty: u32 = if moves > optimal_moves {
        (moves - optimal_moves) * 10
    } else {
        0
    };
    
    // Time bonus (faster = better)
    // 1 point per second under 5 minutes
    let time_bonus: u32 = if time_seconds < 300 {
        let time_u32: u32 = time_seconds.try_into().unwrap();
        (300 - time_u32) / 2
    } else {
        0
    };
    
    // Final calculation
    let difficulty_bonus = difficulty_multiplier * 100;
    let total_positive = base_score + difficulty_bonus + time_bonus;
    
    // Ensure non-negative
    if move_penalty > total_positive {
        0
    } else {
        total_positive - move_penalty
    }
}

// Calculate star rating (1-3 stars)
pub fn calculate_stars(moves: u32, optimal_moves: u32) -> u8 {
    if optimal_moves == 0 {
        return 1;
    }
    
    let move_ratio = (moves * 100) / optimal_moves;
    
    if move_ratio <= 110 {
        3  // 3 stars: within 10% of optimal
    } else if move_ratio <= 150 {
        2  // 2 stars: within 50% of optimal
    } else {
        1  // 1 star: completed but not efficiently
    }
}

// Calculate performance grade
pub fn calculate_grade(score: u32) -> ByteArray {
    if score >= 15000 {
        "S"
    } else if score >= 12000 {
        "A"
    } else if score >= 10000 {
        "B"
    } else if score >= 8000 {
        "C"
    } else if score >= 6000 {
        "D"
    } else {
        "F"
    }
}

#[cfg(test)]
mod tests {
    use super::{calculate_score, calculate_stars, calculate_grade};
    
    #[test]
    fn test_perfect_score() {
        // Perfect game: optimal moves, fast time, hard difficulty
        let score = calculate_score(24, 60, 3);
        assert(score > 12000, 'Perfect score too low');
    }
    
    #[test]
    fn test_score_with_penalties() {
        // More moves than optimal
        let score = calculate_score(40, 120, 2);
        assert(score < 12000, 'Score should be penalized');
    }
    
    #[test]
    fn test_stars_perfect() {
        let stars = calculate_stars(8, 8);
        assert(stars == 3, 'Should be 3 stars');
    }
    
    #[test]
    fn test_stars_good() {
        let stars = calculate_stars(12, 8);
        assert(stars == 2, 'Should be 2 stars');
    }
    
    #[test]
    fn test_stars_ok() {
        let stars = calculate_stars(20, 8);
        assert(stars == 1, 'Should be 1 star');
    }
}

