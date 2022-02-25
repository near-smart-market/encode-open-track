// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, setup_alloc};

use crate::models::*;
use crate::utils::*;
use crate::internal_products::*;
use crate::internal_stores::*;

mod models;
mod utils;
mod internal_products;
mod internal_stores;

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Marketplace {
  orders: UnorderedMap<String, Order>,
  products: UnorderedMap<String, Product>, // how to lookup map with set of 2 values by joining storeId+productId
  stores: UnorderedMap<String, Store>,
}

impl Default for Marketplace {
  fn default() -> Self {
    Self {
      orders: UnorderedMap::new(StorageKey::Orders),
      products: UnorderedMap::new(StorageKey::Products),
      stores: UnorderedMap::new(StorageKey::Stores),
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

    // assert that sender is usdt.test.near, we only support USDT for this POC
    assert_eq!("usdt.test.near", env::predecessor_account_id().to_string());

    env::log(
      format!(
        "received ft_on_transfer: sender_id {} amount {} msg {} pred_account_id {}",
        sender_id,
        amount,
        msg.to_string(),
        env::predecessor_account_id().to_string()
      )
      .as_bytes(),
    );
    let order: Order = near_sdk::serde_json::from_str(&msg).unwrap();
    env::log(format!("ft_on_transfer: order.id {}", order.id.to_string()).as_bytes());

    // Verify that payload amount is same as the amount received
    // order.payload.amount == amount
    assert_eq!(order.payload.amount, amount);

    // verify that order.payload.lineitems[].amount adds up to amount
    

    // TODO: validate msg deserializes to an Order struct
    // TODO: Save the order to the self.orders
    // TODO: return 0 - keep all funds - for now; or return funds if more than necessary are provided
    "0".to_string() // funds to return
  }
}
