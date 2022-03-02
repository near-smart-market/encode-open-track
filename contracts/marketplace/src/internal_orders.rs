use near_sdk::serde_json::json;
use near_sdk::{AccountId, Gas, Promise};

use crate::*;

const BASIC_GAS: Gas = 5_000_000_000_000;

#[near_bindgen]
impl Marketplace {
    #[payable]
    pub fn cancel_order(&mut self, store_account_id: String, order_id: String) -> String {
        assert_one_yocto();
        // Either Store or Customer can cancel the order
        let order = self.orders.get(&order_id).expect("Order does not exist");

        assert!(
            store_account_id == order.store_account_id,
            "Error. Not authorised"
        );

        // check unique storeid
        assert!(
            env::predecessor_account_id() == order.store_account_id
                || env::predecessor_account_id() == order.customer_account_id,
            "Error. Not authorised"
        );

        // TODO: add this back in
        assert!(
            matches!(order.status, OrderStatus::SCHEDULED)
                || matches!(order.status, OrderStatus::PENDING),
            "Only Pending or Scheduled orders can be cancelled"
        );
        self.finalize_cancel_order(order_id);
        // Transfer funds back from marketplace contract to customer
        let contract_id: AccountId = AccountId::from(order.payload.token);
        transfer_funds(
            &contract_id,
            order.payload.amount,
            order.customer_account_id,
        );
        "OK".to_string()
    }

    pub fn finalize_cancel_order(&mut self, order_id: String) {
        // Either Store or Customer can cancel the order
        let mut order = self.orders.get(&order_id).expect("Order does not exist");
        assert!(
            matches!(order.status, OrderStatus::SCHEDULED)
                || matches!(order.status, OrderStatus::PENDING),
            "Only Pending or Scheduled orders can be cancelled"
        );
        order.status = OrderStatus::CANCELLED;
        self.orders.insert(&order_id, &order);
    }

    #[payable]
    pub fn schedule_order(&mut self, store_account_id: String, order_id: String) -> String {
        assert_one_yocto();
        // Either Store or Customer can cancel the order
        let mut order = self.orders.get(&order_id).expect("Order does not exist");

        assert!(
            store_account_id == order.store_account_id,
            "Error. Not authorised"
        );

        // check storeid
        assert!(
            env::predecessor_account_id() == order.store_account_id,
            "Error. Not authorised"
        );

        assert!(
            matches!(order.status, OrderStatus::PENDING),
            "Only Pending orders can be scheduled"
        );

        order.status = OrderStatus::SCHEDULED;
        self.orders.insert(&order_id, &order);
        "OK".to_string()
    }
    pub fn retrieve_order(self, order_id: String) -> Order {
        self.orders.get(&order_id).expect("Order does not exist")
    }
    #[payable]
    pub fn complete_order(&mut self, store_account_id: String, order_id: String) -> String {
        // Can be done by the store only
        assert_one_yocto();
        // Either Store or Customer can cancel the order
        let order = self.orders.get(&order_id).expect("Order does not exist");

        assert!(
            store_account_id == order.store_account_id,
            "Error. Not authorised"
        );

        // check unique storeid
        assert!(
            env::predecessor_account_id() == order.store_account_id,
            "Error. Not authorised"
        );

        assert!(
            matches!(order.status, OrderStatus::SCHEDULED),
            "Only scheduled orders can be Completed"
        );

        self.finalize_complete_order(order_id);

        // Transfer funds back from marketplace contract to store
        let contract_id: AccountId = AccountId::from(order.payload.token);
        transfer_funds(
            &contract_id,
            order.payload.amount,
            order.store_account_id,
        );
        "OK".to_string()
    }

    pub fn finalize_complete_order(&mut self, order_id: String) {
        let mut order = self.orders.get(&order_id).expect("Order does not exist");
        assert!(
            matches!(order.status, OrderStatus::SCHEDULED),
            "Only scheduled orders can be Completed"
        );
        order.status = OrderStatus::COMPLETED;
        self.orders.insert(&order_id, &order);
    }

    pub fn list_customer_orders(self, customer_account_id: String) -> Vec<Order> {
        // TODO: improve performance
        self.orders
            .values()
            .filter(|vec| vec.customer_account_id == customer_account_id)
            .collect()
    }
    pub fn list_store_orders(self, store_account_id: String) -> Vec<Order> {
        // TODO: improve performance
        self.orders
            .values()
            .filter(|vec| vec.store_account_id == store_account_id)
            .collect()
    }
}
