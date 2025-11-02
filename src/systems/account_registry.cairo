use starknet::ContractAddress;
use memorabilia::models::user_account::{UserAccount, UserAccountTrait};
use memorabilia::models::session_policy::{SessionPolicy, SessionPolicyTrait};

#[derive(Drop, Serde)]
#[dojo::event]
pub struct AccountRegistered {
    #[key]
    pub telegram_id: felt252,
    pub account_address: ContractAddress,
    pub owner_public_key: felt252,
    pub timestamp: u64,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct SessionKeyUpdated {
    #[key]
    pub telegram_id: felt252,
    pub account_address: ContractAddress,
    pub new_session_key: felt252,
    pub timestamp: u64,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct SessionPolicyCreated {
    #[key]
    pub account_address: ContractAddress,
    pub expires_at: u64,
}

#[dojo::interface]
trait IAccountRegistry {
    fn register_account(
        ref world: IWorldDispatcher,
        telegram_id: felt252,
        owner_public_key: felt252,
        session_public_key: felt252
    ) -> ContractAddress;
    
    fn update_session_key(
        ref world: IWorldDispatcher,
        telegram_id: felt252,
        new_session_key: felt252
    );
    
    fn get_account(
        world: @IWorldDispatcher,
        telegram_id: felt252
    ) -> UserAccount;
    
    fn create_session_policy(
        ref world: IWorldDispatcher,
        account_address: ContractAddress,
        allowed_contracts: Array<ContractAddress>,
        allowed_methods: Array<felt252>,
        max_fee: u256,
        duration_seconds: u64
    );
    
    fn is_account_registered(
        world: @IWorldDispatcher,
        telegram_id: felt252
    ) -> bool;
}

#[dojo::contract]
mod account_registry {
    use super::{
        UserAccount, UserAccountTrait, SessionPolicy, SessionPolicyTrait,
        AccountRegistered, SessionKeyUpdated, SessionPolicyCreated,
        IAccountRegistry
    };
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use core::poseidon::poseidon_hash_span;
    
    #[abi(embed_v0)]
    impl AccountRegistryImpl of IAccountRegistry<ContractState> {
        fn register_account(
            ref world: IWorldDispatcher,
            telegram_id: felt252,
            owner_public_key: felt252,
            session_public_key: felt252
        ) -> ContractAddress {
            let timestamp = get_block_timestamp();
            
            // Check if telegram_id already registered
            let existing_account = get!(world, telegram_id, UserAccount);
            assert(existing_account.account_address.is_zero(), 'Account already registered');
            
            // Generate deterministic account address from telegram_id and owner key
            let account_address = generate_account_address(telegram_id, owner_public_key);
            
            // Create new user account
            let user_account = UserAccountTrait::new(
                telegram_id,
                owner_public_key,
                session_public_key,
                account_address,
                timestamp
            );
            
            // Store in world state
            set!(world, (user_account));
            
            // Emit event
            emit!(world, (AccountRegistered {
                telegram_id,
                account_address,
                owner_public_key,
                timestamp
            }));
            
            account_address
        }
        
        fn update_session_key(
            ref world: IWorldDispatcher,
            telegram_id: felt252,
            new_session_key: felt252
        ) {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Get existing account
            let mut account = get!(world, telegram_id, UserAccount);
            assert(!account.account_address.is_zero(), 'Account not found');
            
            // Verify caller owns account (in production, add proper signature verification)
            // For now, we'll allow the update
            
            // Update session key
            account.update_session_key(new_session_key);
            account.update_activity(timestamp);
            
            // Save updated account
            set!(world, (account));
            
            // Emit event
            emit!(world, (SessionKeyUpdated {
                telegram_id,
                account_address: account.account_address,
                new_session_key,
                timestamp
            }));
        }
        
        fn get_account(
            world: @IWorldDispatcher,
            telegram_id: felt252
        ) -> UserAccount {
            get!(world, telegram_id, UserAccount)
        }
        
        fn create_session_policy(
            ref world: IWorldDispatcher,
            account_address: ContractAddress,
            allowed_contracts: Array<ContractAddress>,
            allowed_methods: Array<felt252>,
            max_fee: u256,
            duration_seconds: u64
        ) {
            let timestamp = get_block_timestamp();
            let expires_at = timestamp + duration_seconds;
            
            // Create session policy
            let policy = SessionPolicyTrait::new(
                account_address,
                allowed_contracts,
                allowed_methods,
                max_fee,
                expires_at
            );
            
            // Store in world state
            set!(world, (policy));
            
            // Emit event
            emit!(world, (SessionPolicyCreated {
                account_address,
                expires_at
            }));
        }
        
        fn is_account_registered(
            world: @IWorldDispatcher,
            telegram_id: felt252
        ) -> bool {
            let account = get!(world, telegram_id, UserAccount);
            !account.account_address.is_zero()
        }
    }
    
    // Helper function to generate deterministic account address
    fn generate_account_address(telegram_id: felt252, owner_public_key: felt252) -> ContractAddress {
        let hash = poseidon_hash_span(
            array![telegram_id, owner_public_key, 'MEMORABILIA_ACCOUNT'].span()
        );
        
        // Convert hash to ContractAddress
        hash.try_into().unwrap()
    }
}

