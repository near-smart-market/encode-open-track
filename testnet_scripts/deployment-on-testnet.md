Create FT token and setup marketplace
1. Login with near
2. cd contracts/FT
3. ./build.sh
4. near deploy --accountId encode-hack-stablecoin.testnet --wasmFile res/fungible_token.wasm
5. initialize the contract
6. near call encode-hack-stablecoin.testnet new '{"owner_id": "encode-hack-stablecoin.testnet", "total_supply": "1000000000000000", "metadata": { "spec": "ft-1.0.0", "name": "encode-hack-stablecoin", "symbol": "NEAR-SMT", "decimals": 8 }}' --accountId encode-hack-stablecoin.testnet
7. give marketplace a TON of stablecoin tokens
8. 
    near call encode-hack-stablecoin.testnet storage_deposit '' --accountId encode-hack-marketplace.testnet --amount 0.00125
    near call encode-hack-stablecoin.testnet ft_transfer '{"receiver_id": "encode-hack-marketplace.testnet", "amount": "50000000000000"}' --accountId encode-hack-stablecoin.testnet --amount 0.000000000000000000000001


Deploy the marketplace
1. cd contracts/marketplace
2. ./build.sh
3. near deploy --accountId encode-hack-marketplace.testnet --wasmFile res/marketplace.wasm
4. assign stablecoin to the marketplace
5. near call encode-hack-marketplace.testnet set_ft_contract_name '{"ft_contract_name": "encode-hack-stablecoin.testnet"}' --accountId encode-hack-marketplace.testnet --amount 0.000000000000000000000001
6. From here on out, the marketplace is configured to access FT from encode-hack-stablecoin.testnet

Funding for stores and customer accounts:
1. Either send funds from stablecoin using the wallet. 
2. Allow users to buy the tokens from the marketplace