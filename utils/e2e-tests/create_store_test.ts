import { Account, connect, Contract, Near } from "near-api-js";
import f from "@faker-js/faker";
import config from "../config";
import { randomBytes } from "crypto";
import { PublicKey } from "near-api-js/lib/utils";

const contractName = "marketplace.test.near";

async function getRandomBytes(): Promise<string> {
    return new Promise((resolve, reject) => {
        randomBytes(32, (err, buf) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(buf.toString("hex"));
            }
        })
    });
}

async function setUp(near) {
    const suffix = parseInt(Math.floor(Math.random() * 1000000).toString());
    const account = await near.account("test.near");
    const keys = await account.getAccessKeys();
    console.log(account.accountId, " balance ", await account.getAccountBalance(), await account.getAccessKeys());
    const accountName = `store${suffix}.test.near`;
    console.log("Creating ", accountName);

    const outcome = await account.createAccount(
        accountName, // new account name
        PublicKey.fromString(keys[0].public_key),
        "1000000000000000000000000" // initial balance for new account in yoctoNEAR
    );
    console.log("outcome", outcome);
    return {
        accountName,
        outcome
    }
}

async function createStore(near: Near, accountName: string) {
    const account = await near.account(accountName)
    const contract = new Contract(account, contractName, {
        changeMethods: ["create_store"],
        viewMethods: []
    }) as any;
    const createStoreResult = await contract.create_store({
        args: { },
        gas: "300000000000000",
        deposit: "1000000000000000000000000"
    });
    console.log("createStoreResult", createStoreResult);
}

async function test() {
    const near = await connect(config);
    const { accountName, outcome } = await setUp(near);
    const createStoreResult = await createStore(near, accountName);
    // const result = await retrieve_store();
    // TODO: This is just tedious but will be done for a production project. 
}


test();