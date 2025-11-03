use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

/// NFT System for minting score-based NFTs
#[dojo::interface]
trait INFTSystem {
    fn mint_score_nft(
        ref world: IWorldDispatcher,
        recipient: ContractAddress,
        score: u256,
        timestamp: u64,
        game_id: u32,
        difficulty: u8
    ) -> u256;
    
    fn get_nft(
        world: @IWorldDispatcher,
        token_id: u256
    ) -> (ContractAddress, u256, u64, u32, u8);
    
    fn get_total_minted(world: @IWorldDispatcher) -> u256;
}

#[dojo::contract]
mod nft_system {
    use super::INFTSystem;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use memorabilia::models::score_nft::{ScoreNFT, ScoreNFTTrait, NFTCounter, NFTCounterTrait, NFTMetadata};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        NFTMinted: NFTMinted,
    }

    #[derive(Drop, starknet::Event)]
    struct NFTMinted {
        token_id: u256,
        recipient: ContractAddress,
        score: u256,
        timestamp: u64,
        game_id: u32,
        difficulty: u8,
    }

    #[abi(embed_v0)]
    impl NFTSystemImpl of INFTSystem<ContractState> {
        /// Mint an NFT for a high score (score >= 10)
        fn mint_score_nft(
            ref world: IWorldDispatcher,
            recipient: ContractAddress,
            score: u256,
            timestamp: u64,
            game_id: u32,
            difficulty: u8
        ) -> u256 {
            // Validate score eligibility
            assert(ScoreNFTTrait::is_eligible(score), 'Score too low for NFT');
            
            // Validate recipient
            assert(!recipient.is_zero(), 'Invalid recipient');
            
            // Get or create counter
            let mut counter = get!(world, 0, (NFTCounter));
            if counter.total_minted == 0 {
                counter = NFTCounterTrait::new();
            }
            
            // Increment counter to get new token ID
            let token_id = counter.increment();
            
            // Create NFT
            let nft = ScoreNFTTrait::new(
                token_id,
                recipient,
                score,
                timestamp,
                game_id,
                difficulty
            );
            
            // Save NFT and counter
            set!(world, (nft));
            set!(world, (counter));
            
            // Create metadata
            let metadata = NFTMetadata {
                token_id,
                name: 'Memorabilia Score NFT',
                description: 'High Score Achievement',
                image_uri: 'ipfs://...',
            };
            set!(world, (metadata));
            
            // Emit event
            emit!(world, NFTMinted {
                token_id,
                recipient,
                score,
                timestamp,
                game_id,
                difficulty,
            });
            
            token_id
        }
        
        /// Get NFT data
        fn get_nft(
            world: @IWorldDispatcher,
            token_id: u256
        ) -> (ContractAddress, u256, u64, u32, u8) {
            let nft = get!(world, token_id, (ScoreNFT));
            (nft.recipient, nft.score, nft.timestamp, nft.game_id, nft.difficulty)
        }
        
        /// Get total NFTs minted
        fn get_total_minted(world: @IWorldDispatcher) -> u256 {
            let counter = get!(world, 0, (NFTCounter));
            counter.total_minted
        }
    }
}

