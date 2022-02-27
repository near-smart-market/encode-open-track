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
