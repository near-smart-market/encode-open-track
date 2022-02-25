use crate::*;

impl Marketplace {
    // TODO: Storage management, assert_one_yocto, etc.
    pub fn create_store(&mut self, store: Store) {
        // check unique storeid
        let existing_store = self.stores.get(&store.id);
        assert!(existing_store.is_none(), "Store with ID already exists");

        self.stores.insert(&store.id, &store);
    }
    pub fn retrieve_store(self, id: String) -> Option<Store> {
        let store = self.stores.get(&id);
        store
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
}
