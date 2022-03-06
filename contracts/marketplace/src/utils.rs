use near_sdk::{env, near_bindgen, setup_alloc, Promise, AccountId, ext_contract, Gas};
use near_sdk::serde_json::{json};

#[ext_contract]
pub trait ContractB {
    fn ft_transfer(&mut self, receiver_id: String, amount: String, memo: Option<String>);
}


//used to make sure the user attached exactly 1 yoctoNEAR
pub(crate) fn assert_one_yocto() {
    assert_eq!(
        env::attached_deposit(),
        1,
        "Requires attached deposit of exactly 1 yoctoNEAR",
    )
}

const BASIC_GAS: Gas = 5_000_000_000_000;

pub(crate) fn transfer_funds(contract_id: &AccountId, amount: String, recipient_id: String) -> Promise {
    let method_name = b"ft_transfer".to_vec();
    let data: Vec<u8> = json!({
        "receiver_id": recipient_id,
        "amount": amount
    }).to_string().into();
    Promise::new(contract_id.clone()).function_call(
        method_name,
        data, 
        1, // MIN_AMOUNT
        BASIC_GAS
    )
}