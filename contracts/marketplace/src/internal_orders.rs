use crate::*;

impl Marketplace {
    pub fn cancel_order(&mut self, order_id: String) {
        assert_one_yocto();
    }
    pub fn retrieve_order(self, order_id: String) -> Order {
        self.orders.get(&order_id).expect("Order does not exist");
    }
    pub fn complete_order(self, order_id: String) -> Order {
        // Can be done by the store only
        self.orders.get(&order_id).expect("Order does not exist");
    }
    pub fn list_customer_orders(self, customer_account_id: String) -> Vec<Order> {
        // TODO: improve performance
        self.orders
            .values
            .to_vec()
            .into_iter()
            .filter(|vec| vec.customer_account_id == customer_account_id)
            .collect()
    }
    pub fn list_store_orders(self, store_account_id: String) -> Vec<Order> {
        // TODO: improve performance
        self.orders
            .values
            .to_vec()
            .into_iter()
            .filter(|vec| vec.store_account_id == store_account_id)
            .collect()
    }
}
