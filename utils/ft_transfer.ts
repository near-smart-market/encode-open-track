// Transfer funds from one USDT holder to another
import { Account, connect, ConnectConfig, Contract, InMemorySigner, keyStores, Signer, WalletConnection } from "near-api-js";
import * as cla from "command-line-args";
import config from "./config";
const ATTACHED_GAS = "300000000000000";
const YOCTO_NEAR = "1";
console.log(config);

async function execute() {
    const options = cla([
        {
            name: "contractName", alias: "c", type: String, defaultValue: "usdt.test.near",
        },
        {
            name: "accountName", alias: "a", type: String, defaultValue: "dev0.test.near",
        },
        {
            name: "recipientName", alias: "r", type: String, defaultValue: "clifford.test.near",
        },
        {
            name: "amount", type: Number, defaultValue: 1
        }
    ]);

    console.log("options", { options });

    try {
        await run(options);
    }
    catch (error) {
        console.error(error as any);
    }

}

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

async function run(options: cla.CommandLineOptions) {
    console.log(await config.keyStore?.getAccounts("localnet"));
    const near = await connect(config);
    const account = await near.account(options.accountName);
    console.log(account);
    console.log(await account.getAccountBalance());
    const contract: any = await loadContract(options.contractName, account);
    const response = await contract.ft_transfer({
        args: {
            receiver_id: options.recipientName,
            amount: options.amount.toString()
        },
        gas: ATTACHED_GAS, // attached GAS (optional)
        amount: YOCTO_NEAR // attached deposit in yoctoNEAR (optional)
    });
    console.log("response", response);

}

execute();