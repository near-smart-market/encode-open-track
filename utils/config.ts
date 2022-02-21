import { keyStores, ConnectConfig } from "near-api-js";

export default {
    networkId: "localnet",
    nodeUrl: process.env.NEAR_NODE_URL!,
    walletUrl: `${process.env.NEAR_WALLET_URL}/wallet`,
    keyPath: process.env.NEAR_CLI_LOCALNET_KEY_PATH,
    helperUrl: process.env.NEAR_HELPER_URL,
    masterAccount: process.env.NEAR_HELPER_ACCOUNT,
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(`${process.env['HOME']}/.near-credentials`),
    headers: {}
} as ConnectConfig;