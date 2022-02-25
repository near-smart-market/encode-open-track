// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet};
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
  pub fn ft_on_transfer(&mut self, sender_id: String, amount: String, msg: String) -> String {
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

    // Verify that the products are valid
    // TODO: Consider stronger checks. 
    for line_item in order.payload.line_items.iter() {
      let id = format!("{}:{}", order.store_account_id, line_item.product_id);
      self.products.get(&id).expect("Product does not exist");
    }

    // TODO: validate msg deserializes to an Order struct
    // TODO: Save the order to the self.orders
    // TODO: return 0 - keep all funds - for now; or return funds if more than necessary are provided
    self.orders.insert(&order.id, &order);
    "0".to_string() // funds to return
  }
}
