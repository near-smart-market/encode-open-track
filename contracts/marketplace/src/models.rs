use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::BorshStorageKey;

/// Helper structure to for keys of the persistent collections.
#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKey {
    Products,
    Stores,
    Orders, // ByOwnerId,
            // ByOwnerIdInner { account_id_hash: CryptoHash },
            // ByNFTContractId,
            // ByNFTContractIdInner { account_id_hash: CryptoHash },
            // ByNFTTokenType,
            // ByNFTTokenTypeInner { token_type_hash: CryptoHash },
            // FTTokenIds,
            // StorageDeposits
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Product {
    pub id: String,
    pub store_account_id: String,
    pub description: String,
    pub media_url: String,
    pub price: u128,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct LatLng {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Store {
    pub id: String,
    pub lat_lng: LatLng,
    pub address: String,
    pub name: String,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct OrderPayload {
    pub token: String, // This is the stablecoin token - we'll know if it is usdt or inr, cad etc.
    pub amount: String, // this is how much we received in the stablecoin
                   // line_items: LineItem[] // this will contain order details, like shoes - <NFT_ID_FOR_SHOES>, t-shirts <NFT_ID_FOR_TSHIRT>
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Order {
    pub id: String,
    pub customer_account_id: String,
    pub store_account_id: String,
    pub payload: OrderPayload,
}