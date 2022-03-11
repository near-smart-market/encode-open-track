cd ../contracts/FT
ls

./build.sh

echo "Creating usdt.test.near and setting up supply"
ID=usdt.test.near
near deploy --wasmFile res/fungible_token.wasm --accountId $ID
near call $ID new '{"owner_id": "'$ID'", "total_supply": "1000000000000000", "metadata": { "spec": "ft-1.0.0", "name": "localnet-usdt", "symbol": "USDT", "decimals": 8 }}' --accountId $ID

