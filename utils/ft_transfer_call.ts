// Transfer funds from customer account to the contract account
import { Account, connect, ConnectConfig, Contract, InMemorySigner, keyStores, Signer, WalletConnection } from "near-api-js";
import * as cla from "command-line-args";
import config from "./config";
import { join } from "path";

const ATTACHED_GAS = "300000000000000";
const YOCTO_NEAR = "1";
console.log(config);

async function execute() {
    const options = cla([
        {
            name: "contractName", alias: "c", type: String, defaultValue: "usdt.test.near",
        },
        {
            name: "accountName", alias: "a", type: String, defaultValue: "marketplace.test.near",
        },
        {
            name: "recipientName", alias: "r", type: String, defaultValue: "clifford.test.near",
        },
        {
            name: "orderJsonFile", alias: "o", type: String, defaultValue: "orders/order-1.json",
        },
        {
            name: "memo", alias: "m", type: String, defaultValue: "orders-1.json",
        },
        {
            name: "orderId", alias: "i", type: String, defaultValue: "order-1"
        }
    ]);


    try {
        console.log(options);
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
            changeMethods: ["ft_transfer_call"], // change methods modify state
        }
    );

}

async function run(options: cla.CommandLineOptions) {
    const near = await connect(config);
    const account = await near.account(options.accountName);
    const contract: any = await loadContract(options.contractName, account);
    const order = require(join(__dirname, options.orderJsonFile));
    const response = await contract.ft_transfer_call({
        args: {
            receiver_id: options.recipientName,
            amount: order.payload.amount.toString(),
            memo: options.memo,
            msg: JSON.stringify({ ...order, id: options.orderId })
        },
        gas: ATTACHED_GAS, // attached GAS (optional)
        amount: YOCTO_NEAR // attached deposit in yoctoNEAR (optional)
    });
    console.log("response", response);
}

execute();