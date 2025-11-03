use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use core::num::traits::Zero;
use memorabilia::models::user_account::{UserAccount, UserAccountTrait};
use memorabilia::models::session_policy::{SessionPolicy, SessionPolicyTrait};

trait AccountRegistryContract {
    fn world_default(self: @ContractState) -> IWorldDispatcher;
}

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

use dojo::world::IWorldDispatcher;
use core::num::traits::Zero;

#[starknet::interface]
trait IAccountRegistry<T> {
    fn register_account(
        ref self: T,
        telegram_id: felt252,
        owner_public_key: felt252,
        session_public_key: felt252
    ) -> ContractAddress;

    fn update_session_key(
        ref self: T,
        telegram_id: felt252,
        new_session_key: felt252
    );

    fn get_account(
        self: @T,
        telegram_id: felt252
    ) -> UserAccount;

    fn is_account_registered(
        self: @T,
        telegram_id: felt252
    ) -> bool;
}

#[dojo::contract]
mod account_registry_system {
    use super::*;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AccountCreated: AccountCreated,
        SessionStarted: SessionStarted,
    }

    #[derive(Drop, starknet::Event)]
    struct AccountCreated {
        player: ContractAddress,
        telegram_id: felt252,
        username: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct SessionStarted {
        player: ContractAddress,
        telegram_id: felt252,
        session_id: u256,
        timestamp: u64,
        expires_at: u64,
    }

    #[storage]
    struct Storage {
        world: IWorldDispatcher,
    }

    #[constructor]
    fn constructor(ref self: ContractState, world: ContractAddress) {
        self.world.write(IWorldDispatcher { contract_address: world });
    }

    impl AccountRegistryContractImpl of AccountRegistryContract {
        fn world_default(self: @ContractState) -> IWorldDispatcher {
            self.world.read()
        }
    }

    #[external(v0)]

