const sh= require('shelljs');


// Assuming Contracts are build and wasms in wasm folder to current script dir

const calledFromDir = sh.pwd().toString()
console.log(calledFromDir);

if(calledFromDir.match("testnet_script")){
    console.log("Called from testnet scripts");

    let accounts = {
        marketplace: "",
        usdt: "",
    }

    const ft_wasm = `${calledFromDir}/wasm/fungible_token.wasm`;
    const marketplace_wasm = `${calledFromDir}/wasm/marketplace.wasm`;

    let ft_deploy = sh.exec(`near dev-deploy -f ${ft_wasm}`);
    let marketplace_deploy = sh.exec(`near dev-deploy -f ${marketplace_wasm}`);

    if(ft_deploy.code === 0) {
        let ftAccountId = ft_deploy.stdout.match(/(dev-[0-9]*-[0-9]*)\w/)[0];
        console.log("Dev Mid Account: ", ftAccountId);
        accounts.usdt = ftAccountId;
    }

    if(marketplace_deploy.code === 0) {
        let marketplaceAccountId = marketplace_deploy.stdout.match(/(dev-[0-9]*-[0-9]*)\w/)[0];
        console.log("Dev Mid Account: ", marketplaceAccountId);
        accounts.marketplace = marketplaceAccountId;
    }

    console.log("Accounts Formed: ", accounts);

    console.log("Miniting USDT Token");
    const ft_new_mint = sh.exec(`near call ${accounts.usdt} new '{"owner_id": "${accounts.usdt}", "total_supply": "1000000000000000", "metadata": { "spec": "ft-1.0.0", "name": "testnet-usdt", "symbol": "USDT", "decimals": 8 }}' --accountId ${accounts.usdt}`)
    console.log("Status Code: ", ft_new_mint.code);

    console.log("===========================");
    console.log("Distributing USDT Tokens");
    distribute_tokens(accounts.usdt, accounts.marketplace, "prix.testnet");

    console.log("============================");
    const accountsFilePath = `${calledFromDir}/accounts.txt`;
    sh.rm('-f', accountsFilePath);
    require('fs').writeFileSync(accountsFilePath, JSON.stringify(accounts), 'utf-8');
}

function distribute_tokens(usdtAccount, marketplaceAccount, customerAccount) {

    console.log("==============================");
    console.log("Doing Storage deposits!");
    sh.exec(`near call ${usdtAccount} storage_deposit '' --accountId ${customerAccount} --amount 0.00125`);
    sh.exec(`near call ${usdtAccount} storage_deposit '' --accountId ${marketplaceAccount} --amount 0.00125`);

    console.log("===============================");
    console.log("Transferring Tokens");
    sh.exec(`near call ${usdtAccount} ft_transfer '{"receiver_id": "${customerAccount}", "amount": "5000000000"}' --accountId ${usdtAccount} --amount 0.000000000000000000000001`)
    sh.exec(`near call ${usdtAccount} ft_transfer '{"receiver_id": "${marketplaceAccount}", "amount": "5000000000"}' --accountId ${usdtAccount} --amount 0.000000000000000000000001`)


}