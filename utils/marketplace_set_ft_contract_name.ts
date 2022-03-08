// Transfer funds from one USDT holder to another
import { Account, connect, ConnectConfig, Contract, InMemorySigner, keyStores, Signer, WalletConnection } from "near-api-js";
import * as cla from "command-line-args";
import config from "./config";
import { join } from "path";
const ATTACHED_GAS = "300000000000000";
const YOCTO_NEAR = "1000000000000000000000000";

console.log(config);

async function execute() {
    const options = cla([
        {
            name: "contractName", alias: "c", type: String, defaultValue: "marketplace.test.near",
        },
        {
            name: "accountName", alias: "a", type: String, defaultValue: "marketplace.test.near",
        },
        {
            name: "ftContractName", type: String, defaultValue: null,
        },
    ]);

    try {
        console.log(options);
        await run(options);
    }
    catch (error) {
        console.error(error as any);
    }

}

async function initContract(contractName: string, account: Account) {
    return new Contract(
        account, // the account object that is connecting
        contractName,
        {
            // name of contract you're connecting to
            viewMethods: [], // view methods do not change state but usually return a value
            changeMethods: ["set_ft_contract_name"], // change methods modify state
        }
    );
}

async function run(options: cla.CommandLineOptions) {
    const near = await connect(config);
    const account = await near.account(options.accountName);
    console.log(await account.getAccountBalance())
    const contract: any = await initContract(options.contractName, account);
    console.log("contract", { contract }, contract.cancel_order);
    const response = await contract.set_ft_contract_name({
        args: {
            ft_contract_name: options.ftContractName
        },
        gas: ATTACHED_GAS,
        amount: "1"
    });
    console.log("response", { response });
}

execute();