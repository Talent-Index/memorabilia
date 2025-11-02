#[cfg(test)]
mod tests {
    use starknet::ContractAddress;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    
    use memorabilia::models::user_account::{UserAccount, user_account};
    use memorabilia::models::session_policy::{SessionPolicy, session_policy};
    use memorabilia::systems::account_registry::{
        account_registry, IAccountRegistryDispatcher, IAccountRegistryDispatcherTrait
    };
    
    fn setup() -> (IWorldDispatcher, IAccountRegistryDispatcher) {
        let mut models = array![user_account::TEST_CLASS_HASH, session_policy::TEST_CLASS_HASH];
        let world = spawn_test_world(models);
        
        let contract_address = world.deploy_contract('salt', account_registry::TEST_CLASS_HASH);
        let account_registry = IAccountRegistryDispatcher { contract_address };
        
        (world, account_registry)
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_register_account() {
        let (world, registry) = setup();
        
        let telegram_id: felt252 = 123456789;
        let owner_key: felt252 = 'owner_key';
        let session_key: felt252 = 'session_key';
        
        // Register account
        let account_address = registry.register_account(
            telegram_id,
            owner_key,
            session_key
        );
        
        // Verify account was created
        assert(!account_address.is_zero(), 'Address should not be zero');
        
        let account = registry.get_account(telegram_id);
        assert(account.telegram_id == telegram_id, 'Wrong telegram_id');
        assert(account.owner_public_key == owner_key, 'Wrong owner key');
        assert(account.session_public_key == session_key, 'Wrong session key');
        assert(account.is_active, 'Account should be active');
        assert(account.total_games == 0, 'Should have 0 games');
    }
    
    #[test]
    #[available_gas(30000000)]
    #[should_panic(expected: ('Account already registered',))]
    fn test_cannot_register_twice() {
        let (world, registry) = setup();
        
        let telegram_id: felt252 = 123456789;
        let owner_key: felt252 = 'owner_key';
        let session_key: felt252 = 'session_key';
        
        // Register once
        registry.register_account(telegram_id, owner_key, session_key);
        
        // Try to register again - should panic
        registry.register_account(telegram_id, owner_key, session_key);
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_update_session_key() {
        let (world, registry) = setup();
        
        let telegram_id: felt252 = 123456789;
        let owner_key: felt252 = 'owner_key';
        let session_key: felt252 = 'session_key';
        let new_session_key: felt252 = 'new_session_key';
        
        // Register account
        registry.register_account(telegram_id, owner_key, session_key);
        
        // Update session key
        registry.update_session_key(telegram_id, new_session_key);
        
        // Verify update
        let account = registry.get_account(telegram_id);
        assert(account.session_public_key == new_session_key, 'Session key not updated');
        assert(account.nonce == 1, 'Nonce should increment');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_is_account_registered() {
        let (world, registry) = setup();
        
        let telegram_id: felt252 = 123456789;
        let unregistered_id: felt252 = 987654321;
        
        // Check unregistered account
        assert(!registry.is_account_registered(unregistered_id), 'Should not be registered');
        
        // Register account
        registry.register_account(telegram_id, 'owner', 'session');
        
        // Check registered account
        assert(registry.is_account_registered(telegram_id), 'Should be registered');
    }
    
    #[test]
    #[available_gas(30000000)]
    fn test_create_session_policy() {
        let (world, registry) = setup();
        
        let telegram_id: felt252 = 123456789;
        let account_address = registry.register_account(
            telegram_id,
            'owner',
            'session'
        );
        
        // Create session policy
        let allowed_contracts = array![account_address];
        let allowed_methods = array!['start_game', 'flip_card'];
        let max_fee: u256 = 1000000;
        let duration: u64 = 86400; // 24 hours
        
        registry.create_session_policy(
            account_address,
            allowed_contracts,
            allowed_methods,
            max_fee,
            duration
        );
        
        // Policy creation should succeed without panic
    }
}

