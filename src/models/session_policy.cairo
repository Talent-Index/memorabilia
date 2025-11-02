use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
pub struct SessionPolicy {
    #[key]
    pub account_address: ContractAddress,
    pub allowed_contracts: Array<ContractAddress>,
    pub allowed_methods: Array<felt252>,
    pub max_fee: u256,
    pub expires_at: u64,
    pub is_active: bool,
}

#[generate_trait]
pub impl SessionPolicyImpl of SessionPolicyTrait {
    fn new(
        account_address: ContractAddress,
        allowed_contracts: Array<ContractAddress>,
        allowed_methods: Array<felt252>,
        max_fee: u256,
        expires_at: u64
    ) -> SessionPolicy {
        SessionPolicy {
            account_address,
            allowed_contracts,
            allowed_methods,
            max_fee,
            expires_at,
            is_active: true,
        }
    }
    
    fn is_valid(self: @SessionPolicy, current_time: u64) -> bool {
        *self.is_active && current_time < *self.expires_at
    }
    
    fn deactivate(ref self: SessionPolicy) {
        self.is_active = false;
    }
}

