import { Account, connect, ConnectConfig, Contract, InMemorySigner, keyStores, Near, Signer, WalletConnection } from "near-api-js";

async function loadContract(contractName: string, account: Account) {
    return new Contract(
        account, // the account object that is connecting
        contractName,
        {
            // name of contract you're connecting to
            viewMethods: ["ft_balance_of"], // view methods do not change state but usually return a value
            changeMethods: ["ft_transfer"], // change methods modify state
        }
    );

}

class FT_TOKEN {
    
    contractName = "";
    accountName= "";

    config: ConnectConfig = {
        networkId: 'localnet',
        nodeUrl: process.env.NEAR_NODE_URL!,
        headers: {},
    };

    constructor(cname?: string, aname?: string) {
        this.contractName = cname || "usdt.test.near";
        this.accountName = aname || "dev0.test.near";

    }

    async check_balance() {
        console.log("Using config: ", this.config);

        const connection = await connect(this.config);
        const acc = await connection.account(this.accountName);
        const contract: any = await loadContract(this.contractName, acc);
        const response = await contract.ft_balance_of({
            account_id: this.accountName
        });
        console.log("Response Recieved:", {response});
    }


}

export default FT_TOKEN;