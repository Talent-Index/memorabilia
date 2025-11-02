use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
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

#[dojo::interface]
trait IGreetingSystem {
    fn set_greeting(ref world: IWorldDispatcher, message: ByteArray);
    fn get_greeting(world: @IWorldDispatcher, user: ContractAddress) -> ByteArray;
    fn get_greeting_info(world: @IWorldDispatcher, user: ContractAddress) -> Greeting;
}

#[dojo::contract]
mod greeting_system {
    use super::{Greeting, GreetingUpdated, IGreetingSystem};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    
    #[abi(embed_v0)]
    impl GreetingSystemImpl of IGreetingSystem<ContractState> {
        fn set_greeting(ref world: IWorldDispatcher, message: ByteArray) {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Get existing greeting or create new
            let mut greeting = get!(world, caller, Greeting);
            
            // Update greeting
            greeting.user = caller;
            greeting.message = message.clone();
            greeting.updated_at = timestamp;
            greeting.update_count += 1;
            
            // Save to world state
            set!(world, (greeting));
            
            // Emit event
            emit!(world, (GreetingUpdated {
                user: caller,
                message: message,
                timestamp: timestamp
            }));
        }
        
        fn get_greeting(world: @IWorldDispatcher, user: ContractAddress) -> ByteArray {
            let greeting = get!(world, user, Greeting);
            greeting.message
        }
        
        fn get_greeting_info(world: @IWorldDispatcher, user: ContractAddress) -> Greeting {
            get!(world, user, Greeting)
        }
    }
}

