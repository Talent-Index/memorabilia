use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct UserAccount {
    #[key]
    pub telegram_id: felt252,
    pub owner_public_key: felt252,
    pub session_public_key: felt252,
    pub account_address: ContractAddress,
    pub created_at: u64,
    pub last_active: u64,
    pub nonce: u32,
    pub total_games: u32,
    pub is_active: bool,
}

#[generate_trait]
pub impl UserAccountImpl of UserAccountTrait {
    fn new(
        telegram_id: felt252,
        owner_public_key: felt252,
        session_public_key: felt252,
        account_address: ContractAddress,
        created_at: u64
    ) -> UserAccount {
        UserAccount {
            telegram_id,
            owner_public_key,
            session_public_key,
            account_address,
            created_at,
            last_active: created_at,
            nonce: 0,
            total_games: 0,
            is_active: true,
        }
    }
    
    fn update_activity(ref self: UserAccount, timestamp: u64) {
        self.last_active = timestamp;
    }
    
    fn increment_games(ref self: UserAccount) {
        self.total_games += 1;
    }
    
    fn update_session_key(ref self: UserAccount, new_session_key: felt252) {
        self.session_public_key = new_session_key;
        self.nonce += 1;
    }
}

