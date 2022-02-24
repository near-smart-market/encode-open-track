cd ../contracts/marketplace
./build.sh

# local_near doesn't work in this file. don't have time to figure it out
NEAR_ENV="local" NEAR_CLI_LOCALNET_NETWORK_ID="localnet" NEAR_NODE_URL="http://127.0.0.1:49158" NEAR_CLI_LOCALNET_KEY_PATH="/home/prix/.neartosis/2022-02-21T21.46.54/validator-key.json" NEAR_WALLET_URL="http://127.0.0.1:49162" NEAR_HELPER_URL="http://127.0.0.1:49159" NEAR_HELPER_ACCOUNT="test.near" NEAR_EXPLORER_URL="http://127.0.0.1:49161" near deploy --wasmFile res/marketplace.wasm --accountId marketplace.test.near