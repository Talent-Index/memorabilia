#[cfg(test)]
mod tests {
    use starknet::{ContractAddress, contract_address_const, get_block_timestamp};
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    
    use memorabilia::models::score_nft::{ScoreNFT, score_nft, NFTCounter, nft_counter, NFTMetadata, nft_metadata};
    use memorabilia::systems::nft_system::{nft_system, INFTSystemDispatcher, INFTSystemDispatcherTrait};

    fn setup() -> (IWorldDispatcher, INFTSystemDispatcher, ContractAddress) {
        // Spawn test world with models
        let mut models = array![
            score_nft::TEST_CLASS_HASH,
            nft_counter::TEST_CLASS_HASH,
            nft_metadata::TEST_CLASS_HASH,
        ];
        let world = spawn_test_world(models);
        
        // Deploy NFT system
        let contract_address = world.deploy_contract('salt', nft_system::TEST_CLASS_HASH.try_into().unwrap());
        let nft_system = INFTSystemDispatcher { contract_address };
        
        // Create test player
        let player = contract_address_const::<0x123>();
        
        (world, nft_system, player)
    }

    #[test]
    #[available_gas(30000000)]
    fn test_mint_nft_with_high_score() {
        let (world, nft_system, player) = setup();
        
        // Mint NFT with score 15 (eligible)
        let token_id = nft_system.mint_score_nft(
            recipient: player,
            score: 15,
            timestamp: 1234567890,
            game_id: 1,
            difficulty: 1
        );
        
        // Verify token ID
        assert(token_id == 1, 'Wrong token ID');
        
        // Verify NFT data
        let (recipient, score, timestamp, game_id, difficulty) = nft_system.get_nft(token_id);
        assert(recipient == player, 'Wrong recipient');
        assert(score == 15, 'Wrong score');
        assert(timestamp == 1234567890, 'Wrong timestamp');
        assert(game_id == 1, 'Wrong game ID');
        assert(difficulty == 1, 'Wrong difficulty');
        
        // Verify total minted
        let total = nft_system.get_total_minted();
        assert(total == 1, 'Wrong total minted');
    }

    #[test]
    #[available_gas(30000000)]
    #[should_panic(expected: ('Score too low for NFT', ))]
    fn test_mint_nft_with_low_score() {
        let (world, nft_system, player) = setup();
        
        // Try to mint NFT with score 5 (not eligible)
        nft_system.mint_score_nft(
            recipient: player,
            score: 5,
            timestamp: 1234567890,
            game_id: 1,
            difficulty: 0
        );
    }

    #[test]
    #[available_gas(30000000)]
    #[should_panic(expected: ('Score too low for NFT', ))]
    fn test_mint_nft_with_score_9() {
        let (world, nft_system, player) = setup();
        
        // Try to mint NFT with score 9 (not eligible, needs >= 10)
        nft_system.mint_score_nft(
            recipient: player,
            score: 9,
            timestamp: 1234567890,
            game_id: 1,
            difficulty: 0
        );
    }

    #[test]
    #[available_gas(30000000)]
    fn test_mint_nft_with_score_10() {
        let (world, nft_system, player) = setup();
        
        // Mint NFT with score exactly 10 (eligible)
        let token_id = nft_system.mint_score_nft(
            recipient: player,
            score: 10,
            timestamp: 1234567890,
            game_id: 1,
            difficulty: 0
        );
        
        // Verify token ID
        assert(token_id == 1, 'Wrong token ID');
        
        // Verify score
        let (_, score, _, _, _) = nft_system.get_nft(token_id);
        assert(score == 10, 'Wrong score');
    }

    #[test]
    #[available_gas(30000000)]
    #[should_panic(expected: ('Invalid recipient', ))]
    fn test_mint_nft_with_zero_address() {
        let (world, nft_system, _) = setup();
        
        // Try to mint NFT to zero address
        nft_system.mint_score_nft(
            recipient: contract_address_const::<0x0>(),
            score: 15,
            timestamp: 1234567890,
            game_id: 1,
            difficulty: 1
        );
    }

    #[test]
    #[available_gas(30000000)]
    fn test_mint_multiple_nfts() {
        let (world, nft_system, player) = setup();
        
        // Mint first NFT
        let token_id_1 = nft_system.mint_score_nft(
            recipient: player,
            score: 15,
            timestamp: 1234567890,
            game_id: 1,
            difficulty: 1
        );
        
        // Mint second NFT
        let token_id_2 = nft_system.mint_score_nft(
            recipient: player,
            score: 20,
            timestamp: 1234567900,
            game_id: 2,
            difficulty: 2
        );
        
        // Verify token IDs are sequential
        assert(token_id_1 == 1, 'Wrong first token ID');
        assert(token_id_2 == 2, 'Wrong second token ID');
        
        // Verify total minted
        let total = nft_system.get_total_minted();
        assert(total == 2, 'Wrong total minted');
        
        // Verify both NFTs have correct data
        let (_, score_1, _, _, _) = nft_system.get_nft(token_id_1);
        let (_, score_2, _, _, _) = nft_system.get_nft(token_id_2);
        assert(score_1 == 15, 'Wrong first score');
        assert(score_2 == 20, 'Wrong second score');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_mint_nft_with_different_difficulties() {
        let (world, nft_system, player) = setup();
        
        // Mint NFT with easy difficulty
        let token_id_1 = nft_system.mint_score_nft(
            recipient: player,
            score: 12,
            timestamp: 1234567890,
            game_id: 1,
            difficulty: 0 // Easy
        );
        
        // Mint NFT with hard difficulty
        let token_id_2 = nft_system.mint_score_nft(
            recipient: player,
            score: 25,
            timestamp: 1234567900,
            game_id: 2,
            difficulty: 2 // Hard
        );
        
        // Verify difficulties
        let (_, _, _, _, diff_1) = nft_system.get_nft(token_id_1);
        let (_, _, _, _, diff_2) = nft_system.get_nft(token_id_2);
        assert(diff_1 == 0, 'Wrong first difficulty');
        assert(diff_2 == 2, 'Wrong second difficulty');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_get_total_minted_initially_zero() {
        let (world, nft_system, _) = setup();
        
        // Verify total minted is 0 initially
        let total = nft_system.get_total_minted();
        assert(total == 0, 'Initial total should be 0');
    }
}

