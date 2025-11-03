use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Greeting {
    #[key]
    pub user: ContractAddress,
    pub message: ByteArray,
    pub updated_at: u64,
    pub update_count: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct GreetingUpdated {
    #[key]
    pub user: ContractAddress,
    pub message: ByteArray,
    pub timestamp: u64,
}

// Dojo 1.8.0: Use #[starknet::interface] instead of #[dojo::interface]
#[starknet::interface]
trait IGreetingSystem<T> {
    fn set_greeting(ref self: T, message: ByteArray);
    fn get_greeting(self: @T, user: ContractAddress) -> ByteArray;
    fn get_greeting_info(self: @T, user: ContractAddress) -> Greeting;
}

#[dojo::contract]
mod greeting_system {
    use super::{Greeting, GreetingUpdated, IGreetingSystem};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
    use dojo::world::WorldStorage;

    #[abi(embed_v0)]
    impl GreetingSystemImpl of IGreetingSystem<ContractState> {
        fn set_greeting(ref self: ContractState, message: ByteArray) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Get existing greeting or create new
            let mut greeting: Greeting = world.read_model(caller);

            // Update greeting
            greeting.user = caller;
            greeting.message = message.clone();
            greeting.updated_at = timestamp;
            greeting.update_count += 1;

            // Save to world state
            world.write_model(@greeting);

            // Emit event
            world.emit_event(@GreetingUpdated {
                user: caller,
                message: message,
                timestamp: timestamp
            });
        }

        fn get_greeting(self: @ContractState, user: ContractAddress) -> ByteArray {
            let world = self.world_default();
            let greeting: Greeting = world.read_model(user);
            greeting.message
        }

        fn get_greeting_info(self: @ContractState, user: ContractAddress) -> Greeting {
            let world = self.world_default();
            world.read_model(user)
        }
    }
}

