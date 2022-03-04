use crate::*;

#[near_bindgen]
impl Marketplace {
    // TODO: Storage management, assert_one_yocto, etc.
    #[payable]
    pub fn create_store(&mut self, store: Store) -> String {
        assert_one_yocto();
        // check unique storeid
        assert!(
            env::predecessor_account_id() == store.id,
            "Store ID must match the account name"
        );

        let existing_store = self.stores.get(&store.id);
        assert!(existing_store.is_none(), "Store with ID already exists");

        self.stores.insert(&store.id, &store);

        "OK".to_string()
    }
    pub fn retrieve_store(self, id: String) -> Option<Store> {
        let store = self.stores.get(&id);
        store
    }
    pub fn list_stores(self) -> Vec<Store> {
        self.stores.values().collect()
    }

    pub fn update_store(
        &mut self,
        id: String,
        name: Option<String>,
        address: Option<String>,
        lat_lng: Option<LatLng>,
    ) {
        let mut store = self.stores.get(&id).expect("Store does not exist");
        match name {
            Some(x) => store.name = x,
            None => {}
        }
        match address {
            Some(x) => store.address = x,
            None => {}
        }
        match lat_lng {
            Some(x) => store.lat_lng = x,
            None => {}
        }
        self.stores.insert(&id, &store);
    }
    pub(crate) fn delete_store(self, id: String) {
        assert_one_yocto();
        // TODO: Delete all products
        // TODO: Refund storage
    }

    pub fn list_store_products(self, id: String) -> Vec<Product> {
        self.stores.get(&id).expect("Store does not exist");
        self.products
            .values()
            .filter(|x| x.store_account_id == id)
            .collect()
    }
}

// TEST: update store
// TEST: retrieve store
// TEST: list_store_products

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
    fn test_list_stores_with_empty_state() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let contract = Marketplace::default();
        let stores = contract.list_stores();
        assert_eq!(0, stores.len());
    }

    // TEST: create store fails when no deposit provided
    #[test]
    fn test_create_store_fail_when_no_deposit_provided() {
        assert_panic!({
            let context = get_context(vec![], false);
            testing_env!(context);
            let mut contract = Marketplace::default();
            let store: Store = Store {
                id: "fabrics-delivery.test.near".to_string(),
                lat_lng: LatLng {
                    latitude: 43.651070,
                    longitude: -79.347015,
                },
                address: "Toronto, Canada".to_string(),
                name: "Fabrics Delivery".to_string(),
            };
            contract.create_store(store);
        }, String, starts with "assertion failed:");
    }

    // TEST: create store fails when pred account doesn't match
    #[test]
    fn test_create_store_fail_when_pred_account_does_not_match() {
        assert_panic!({
            let context = get_context(vec![], false);
            testing_env!(context);
            let mut contract = Marketplace::default();
            let store: Store = Store {
                id: "fabrics-delivery.test.near".to_string(),
                lat_lng: LatLng {
                    latitude: 43.651070,
                    longitude: -79.347015,
                },
                address: "Toronto, Canada".to_string(),
                name: "Fabrics Delivery".to_string(),
            };
            contract.create_store(store);
        }, String, starts with "assertion failed:");
    }

    // TEST: create store success
    #[test]
    fn test_create_store_success() {
        let mut context = get_context(vec![], false);
        context.attached_deposit = 1;
        context.predecessor_account_id = "fabrics-delivery.test.near".to_string();
        testing_env!(context);
        let mut contract = Marketplace::default();
        let store: Store = Store {
            id: "fabrics-delivery.test.near".to_string(),
            lat_lng: LatLng {
                latitude: 43.651070,
                longitude: -79.347015,
            },
            address: "Toronto, Canada".to_string(),
            name: "Fabrics Delivery".to_string(),
        };
        let result = contract.create_store(store);
        assert_eq!(result, "OK".to_string());
    }
    #[test]
    fn test_failure_ft_transfer_call_with_incorrect_amounts() {
        assert_panic!(
          {
            let context = get_context(vec![], false);
            testing_env!(context);
            let mut contract = Marketplace::default();
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
