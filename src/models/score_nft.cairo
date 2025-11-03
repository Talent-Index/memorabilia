use starknet::ContractAddress;

/// NFT minted for high scores (score >= 10)
#[derive(Drop, Serde, Introspect)]
#[dojo::model]
pub struct ScoreNFT {
    #[key]
    pub token_id: u256,
    pub recipient: ContractAddress,
    pub score: u256,
    pub timestamp: u64,
    pub game_id: u32,
    pub difficulty: u8,
}

#[generate_trait]
pub impl ScoreNFTImpl of ScoreNFTTrait {
    fn new(
        token_id: u256,
        recipient: ContractAddress,
        score: u256,
        timestamp: u64,
        game_id: u32,
        difficulty: u8
    ) -> ScoreNFT {
        ScoreNFT {
            token_id,
            recipient,
            score,
            timestamp,
            game_id,
            difficulty,
        }
    }

    fn is_eligible(score: u256) -> bool {
        score >= 10
    }
}

/// NFT metadata for display
#[derive(Drop, Serde, Introspect)]
#[dojo::model]
pub struct NFTMetadata {
    #[key]
    pub token_id: u256,
    pub name: felt252,
    pub description: felt252,
    pub image_uri: felt252,
}

/// Track total NFTs minted
#[derive(Drop, Serde, Introspect)]
#[dojo::model]
pub struct NFTCounter {
    #[key]
    pub id: u8, // Always 0, singleton
    pub total_minted: u256,
}

#[generate_trait]
pub impl NFTCounterImpl of NFTCounterTrait {
    fn new() -> NFTCounter {
        NFTCounter {
            id: 0,
            total_minted: 0,
        }
    }

    fn increment(ref self: NFTCounter) -> u256 {
        self.total_minted += 1;
        self.total_minted
    }
}

