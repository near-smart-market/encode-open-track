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
    fn test_list_store_orders() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Marketplace::default();
        contract.ft_contract_name = String::from("usdt.test.near");
        let stores = contract.list_store_orders("fabrics-delivery.test.near".to_string());
        assert_eq!(0, stores.len());
    }

    #[test]
    fn test_list_customer_orders() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Marketplace::default();
        contract.ft_contract_name = String::from("usdt.test.near");
        let stores = contract.list_customer_orders("fabrics-delivery.test.near".to_string());
        assert_eq!(0, stores.len());
    }

    #[test]
    fn test_cancel_non_existing_order_should_fail(){
        assert_panic!({
            let mut context = get_context(vec![], false);
            context.attached_deposit = 1;
            testing_env!(context);
            let mut contract = Marketplace::default();
            contract.ft_contract_name = String::from("usdt.test.near");
            contract.cancel_order("fabrics-delivery.test.near".to_string(), "order-1".to_string());
        }, String, "Order does not exist");
    }

}
