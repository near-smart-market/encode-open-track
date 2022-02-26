use crate::*;

#[near_bindgen]
impl Marketplace {
    #[payable]
    pub fn create_product(&mut self, product: Product) -> String {
        assert_one_yocto();
        let store = self
            .stores
            .get(&product.store_account_id)
            .expect("Store does not exist");
        let id = format!("{}:{}", store.id, product.id);
        self.products.insert(&id, &product);
        id.to_string()
    }
    pub fn retrieve_product(self, id: String) -> Option<Product> {
        self.products.get(&id)
    }
    pub fn update_product(
        &mut self,
        id: String,
        store_account_id: String,
        description: Option<String>,
        media_url: Option<String>,
        name: Option<String>,
        price: Option<u128>,
    ) -> String {
        self.stores
            .get(&store_account_id)
            .expect("Store does not exist");
        let mut product = self.products.get(&id).expect("Product does not exist");
        match description {
            Some(x) => product.description = x,
            None => {}
        }
        match media_url {
            Some(x) => product.media_url = x,
            None => {}
        }
        match price {
            Some(x) => product.price = x,
            None => {}
        }
        match name {
            Some(x) => product.name = x,
            None => {}
        }
        let id = format!("{}:{}", store_account_id, product.id);
        self.products.insert(&id, &product);
        "OK".to_string()
    }
    pub fn delete_product(self) {
        assert_one_yocto();
        // TODO: Delete product
        // TODO: Refund storage
    }
}
