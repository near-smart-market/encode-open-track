// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc};
use near_sdk::collections::LookupMap;
use near_sdk::serde::{Deserialize, Serialize};

setup_alloc!();

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct OrderPayload {
    token: String, // This is the stablecoin token - we'll know if it is usdt or inr, cad etc.
    amount: String, // this is how much we received in the stablecoin
    // line_items: LineItem[] // this will contain order details, like shoes - 10, t-shirts 20
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Order {
    id: String,
    customer_account_id: String,
    store_account_id: String,
    payload: OrderPayload,
}


// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Marketplace {
    orders: LookupMap<String, Order>
}

impl Default for Marketplace {
  fn default() -> Self {
    Self {
      orders: LookupMap::new(b"o".to_vec()),
    }
  }
}

#[near_bindgen]
impl Marketplace {

    // This is the entrypoint into actually creating an order
    // We must receive valid funds from the stablecoin contract to create the order
    // Order line items must be validated against NFTs which contain product details
    pub fn ft_on_transfer(self, sender_id: String, amount: String, msg: String) -> String {
        // { order_id: ..., line_items: [ ... , ... , ]}
        env::log(format!("received ft_on_transfer: sender_id {} amount {} msg {}", sender_id, amount, msg.to_string()).as_bytes());
        let order: Order = near_sdk::serde_json::from_str(&msg).unwrap();
        env::log(format!("ft_on_transfer: order.id {}", order.id.to_string()).as_bytes());
        
        // TODO: validate msg deserializes to an Order struct
        // TODO: Save the order to the self.orders
        // TODO: return 0 - keep all funds - for now; or return funds if more than necessary are provided
        "0".to_string() // funds to return
    }
}


// Test are omitted on purpose. Must move and implement tests in a different file.

// /*
//  * The rest of this file holds the inline tests for the code above
//  * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
//  *
//  * To run from contract directory:
//  * cargo test -- --nocapture
//  *
//  * From project root, to run in combination with frontend tests:
//  * yarn test
//  *
//  */
// #[cfg(test)]
// mod tests {
//     // // use super::*;
//     // use near_sdk::MockedBlockchain;
//     // use near_sdk::{testing_env, VMContext};

//     // // mock the context for testing, notice "signer_account_id" that was accessed above from env::
//     // fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
//     //     VMContext {
//     //         current_account_id: "alice_near".to_string(),
//     //         signer_account_id: "bob_near".to_string(),
//     //         signer_account_pk: vec![0, 1, 2],
//     //         predecessor_account_id: "carol_near".to_string(),
//     //         input,
//     //         block_index: 0,
//     //         block_timestamp: 0,
//     //         account_balance: 0,
//     //         account_locked_balance: 0,
//     //         storage_usage: 0,
//     //         attached_deposit: 0,
//     //         prepaid_gas: 10u64.pow(18),
//     //         random_seed: vec![0, 1, 2],
//     //         is_view,
//     //         output_data_receivers: vec![],
//     //         epoch_height: 19,
//     //     }
//     // }

//     // #[test]
//     // fn set_then_get_greeting() {
//     //     let context = get_context(vec![], false);
//     //     testing_env!(context);
//     //     let mut contract = Welcome::default();
//     //     contract.set_greeting("howdy".to_string());
//     //     assert_eq!(
//     //         "howdy".to_string(),
//     //         contract.get_greeting("bob_near".to_string())
//     //     );
//     // }

//     // #[test]
//     // fn get_default_greeting() {
//     //     let context = get_context(vec![], true);
//     //     testing_env!(context);
//     //     let contract = Welcome::default();
//     //     // this test did not call set_greeting so should return the default "Hello" greeting
//     //     assert_eq!(
//     //         "Hello".to_string(),
//     //         contract.get_greeting("francis.near".to_string())
//     //     );
//     // }
// }
