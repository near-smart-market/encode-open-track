import {
  Account,
  connect,
  ConnectConfig,
  keyStores,
  Near,
  WalletConnection,
  Contract,
} from "near-api-js";
import { ContractMethods } from "near-api-js/lib/contract";
import { BrowserLocalStorageKeyStore } from "near-api-js/lib/key_stores";
import { createContext, useEffect, useContext, useState } from "react";
import Loading from "../components/loading";
import { getConfig } from "../utils/config";

type CurrentUser = {
  accountId: string;
  balance: string;
};

type WalletContext = {
  walletConnection: undefined | WalletConnection;
  contract: undefined | Contract;
  nearConfig: any;
  currentUser: undefined | CurrentUser;
  usdtContract: undefined | Contract;
};

const WalletContext = createContext<WalletContext>({
  walletConnection: undefined,
  contract: undefined,
  nearConfig: undefined,
  currentUser: undefined,
  usdtContract: undefined
});

// Initializing contract
async function initContract() {
  // get network configuration values from config.js
  // based on the network ID we pass to getConfig()
  const nearConfig = getConfig("development");

  // create a keyStore for signing transactions using the user's key
  // which is located in the browser local storage after user logs in
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();

  // Initializing connection to the NEAR testnet
  const near = await connect({
    keyStore,
    ...nearConfig,
    headers: {},
  } as ConnectConfig);

  // Initialize wallet connection
  const walletConnection = new WalletConnection(near, null);

  // Load in user's account data
  let currentUser: CurrentUser = { accountId: "", balance: "" };
  if (walletConnection.getAccountId()) {
    currentUser = {
      // Gets the accountId as a string
      accountId: walletConnection.getAccountId(),
      // Gets the user's token balance
      balance: (await walletConnection.account().state()).amount,
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const contract = await new Contract(
    // User's accountId as a string
    walletConnection.account(),
    // accountId of the contract we will be loading
    // NOTE: All contracts on NEAR are deployed to an account and
    // accounts can only have one contract deployed to them.
    nearConfig.contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: [
        "list_customer_orders",
        "list_store_orders",
        "list_store_products",
        "list_stores",
        "retrieve_order",
        "retrieve_product",
        "retrieve_store",
      ],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: [
        "create_product",
        "update_product",
        "create_store",
        "schedule_order",
        "cancel_order",
        "complete_order",
      ],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: walletConnection.getAccountId(),
    } as ContractMethods
  );

  const usdtContractAddress = "encode-hack-stablecoin.testnet"; // TODO: make it an env.var please
  const usdtContract = await new Contract(
    walletConnection.account(),
    usdtContractAddress,
    {
      // name of contract you're connecting to
      viewMethods: ["ft_balance_of"], // view methods do not change state but usually return a value
      changeMethods: ["ft_transfer_call"], // change methods modify state
      sender: walletConnection.getAccountId()
    } as ContractMethods
  );

  return { contract, currentUser, nearConfig, walletConnection, usdtContract };
}

const signIn = (wallet: WalletConnection, contract: any, config: any) => {
  wallet.requestSignIn(
    {
      contractId: config.contractName,
      methodNames: [],
    }, //contract requesting access
    "Nearbay Marketplace", //optional name
    undefined, //optional URL to redirect to if the sign in was successful
    undefined //optional URL to redirect to if the sign in was NOT successful
  );
};

const signOut = (wallet: WalletConnection) => {
  wallet.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
};

const WalletContextWrapper = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [walletConnection, setWalletConnection] = useState<WalletConnection>();
  const [contract, setContract] = useState<Contract>();
  const [usdtContract, setUsdtContract] = useState<Contract>();
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [nearConfig, setNearConfig] = useState<any>();

  useEffect(() => {
    // setKeyStore(new keyStores.BrowserLocalStorageKeyStore());
    (async () => {
      const { contract, currentUser, nearConfig, walletConnection, usdtContract } =
        await initContract();
      console.log(contract, currentUser, nearConfig, walletConnection, usdtContract);
      setWalletConnection(walletConnection);
      setContract(contract);
      setCurrentUser(currentUser);
      setNearConfig(nearConfig);
      setUsdtContract(usdtContract);
      // signIn(walletConnection, contract, nearConfig);
      if (walletConnection.isSignedIn()) {
        console.log("User is Signed In.");
      } else {
        alert("Please Sign in To use Nearbay.");
        signIn(walletConnection, contract, nearConfig);
      }
      setLoading(false);

      // walletSignIn(walletConnection, nearConfig.contractName);
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <WalletContext.Provider
      value={{
        walletConnection,
        contract,
        nearConfig,
        currentUser,
        usdtContract
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

const useWalletContext = () => {
  return useContext(WalletContext);
};

export {
  WalletContext,
  WalletContextWrapper,
  useWalletContext,
  signIn,
  signOut,
};
