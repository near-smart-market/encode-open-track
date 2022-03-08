// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use assert_panic::assert_panic;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet};
use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::serde_json::json;
use near_sdk::json_types::U128;
use near_sdk::{env, log, near_bindgen, setup_alloc};

use crate::internal_orders::*;
use crate::internal_products::*;
use crate::internal_stores::*;
use crate::models::*;
use crate::utils::*;

mod internal_orders;
mod internal_products;
mod internal_stores;
mod models;
mod utils;

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Marketplace {
  orders: UnorderedMap<String, Order>,
  products: UnorderedMap<String, Product>, // how to lookup map with set of 2 values by joining storeId+productId
  stores: UnorderedMap<String, Store>,
  ft_contract_name: String,
}

impl Default for Marketplace {
  fn default() -> Self {
    Self {
      orders: UnorderedMap::new(StorageKey::Orders),
      products: UnorderedMap::new(StorageKey::Products),
      stores: UnorderedMap::new(StorageKey::Stores),
      ft_contract_name: String::from("")
    }
  }
}

#[near_bindgen]
impl Marketplace {
  #[payable]
  pub fn set_ft_contract_name(&mut self, ft_contract_name: String) -> String{
    // only contract owner can call this method
    assert_eq!(env::predecessor_account_id(), env::signer_account_id());
    assert_one_yocto();
    self.ft_contract_name = ft_contract_name;
    String::from("OK")
  }

  // This is the entrypoint into actually creating an order
  // We must receive valid funds from the stablecoin contract to create the order
  pub fn ft_on_transfer(&mut self, sender_id: String, amount: String, msg: String) -> String {
    // assert that sender is usdt.test.near, we only support USDT for this POC
    assert_eq!(self.ft_contract_name, env::predecessor_account_id().to_string());

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
    let id = format!("{}:{}", order.store_account_id, order.id);
    self.orders.insert(&id, &order);
    "0".to_string() // funds to return
  }

  #[payable]
  pub fn buy_ft(&mut self){
      log!("This contract expects atleast 1 NEAR in deposit, but will only give you 100 NEAR-SMT. Use at your own risk. :) ");
      assert_eq!(env::attached_deposit() >= 1000000000000000000000000, true);
      let account_id = env::signer_account_id();
      let amount_in_ft: String = String::from("100000000");
      transfer_funds(&self.ft_contract_name, amount_in_ft, account_id);
  }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
  use super::*;
  use near_sdk::MockedBlockchain;
  use near_sdk::{testing_env, VMContext};

  // mock the context for testing, notice "signer_account_id" that was accessed above from env::
  fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
    VMContext {
      current_account_id: "marketplace.test.near".to_string(),
      signer_account_id: "customer.test.near".to_string(),
      signer_account_pk: vec![0, 1, 2],
      predecessor_account_id: "usdt.test.near".to_string(),
      input,
      block_index: 0,
      block_timestamp: 0,
      account_balance: 0,
      account_locked_balance: 0,
      storage_usage: 0,
      attached_deposit: 0,
      prepaid_gas: 10u64.pow(18),
      random_seed: vec![0, 1, 2],
      is_view,
      output_data_receivers: vec![],
      epoch_height: 19,
    }
  }

  #[test]
  fn test_successful_ft_transfer_call_with_order_creation() {
    let context = get_context(vec![], false);
    testing_env!(context);
    let mut contract = Marketplace::default();
    contract.ft_contract_name = String::from("usdt.test.near");
    let data = json!({
      "id": "order-id",
      "customer_account_id": "customer.test.near",
      "store_account_id": "fabrics-delivery.test.near",
      "payload": {
        "token": "usdt.test.near",
        "amount": "1000000",
        "line_items": []
      },
      "status": OrderStatus::PENDING
    })
    .to_string();
    assert_eq!(
      "0".to_string(),
      contract.ft_on_transfer(
        "customer.test.near".to_string(),
        "1000000".to_string(),
        data
      )
    );
  }

  #[test]
  fn test_failure_ft_transfer_call_with_incorrect_amounts() {
    assert_panic!(
      {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Marketplace::default();
        contract.ft_contract_name = String::from("usdt.test.near");
        let data = json!({
          "id": "order-id",
          "customer_account_id": "customer.test.near",
          "store_account_id": "fabrics-delivery.test.near",
          "payload": {
            "token": "usdt.test.near",
            "amount": "1000001",
            "line_items": []
          },
          "status": OrderStatus::PENDING
        })
        .to_string();
        contract.ft_on_transfer(
          "customer.test.near".to_string(),
          "1000000".to_string(),
          data,
        );
      },
      String,
      starts with "assertion failed:"
    );
  }
}
