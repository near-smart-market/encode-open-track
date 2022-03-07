import { createContext, useContext, useState, useEffect } from "react";
import { ProductDetails, ProductDetailsBC } from "../components/product_card";
import { getProduct } from "../utils/fakeData";
import { useWalletContext } from "./walletContext";

const ATTACHED_GAS = "300000000000000";
const YOCTO_NEAR = "1";

export type MarketplaceProps = {
  products: Array<ProductDetails>;
  stores: Array<StoreDetails>;
  selfStore?: StoreDetails;
  selfProducts?: Array<ProductDetailsBC>;
};

export type StoreDetails = {
  address: string;
  id: string;
  lat_lng: {
    latitude: number;
    longitude: number;
  };
  name: string;
};


const sampleStore = {
  id: "prix.testnet",
  address: "Toronto, Canada",
  name: "Fabrics Delivery Store",
  lat_lng: {
    latitude: 43.65107,
    longitude: -79.347015,
  },
};

const create_store = async (contract: any, store: any) => {
  const response = await contract.create_store({
    args: { store },
    gas: ATTACHED_GAS,
    amount: "1",
    meta: "create_store",
  });
};

const retrieve_store = async (
  contract: any,
  store_id: any,
  currentAccountId: any
) => {
  const response = await contract.retrieve_store({
    account_id: currentAccountId,
    id: store_id,
  });
  return response;
};

export const create_product = async (
  contract: any,
  product: ProductDetailsBC
) => {
  const response = await contract.create_product({
    args: { product },
    gas: ATTACHED_GAS,
    amount: "1",
    meta: "create_product",
  });
  return response;
};

// TODO: Check for this one gets a response
// Error: {"index":0,"kind":{"ExecutionError":"Smart contract panicked: panicked at 'Product does not exist', src/internal_products.rs:31:50"}}
export const update_product = async (
  contract: any,
  product: ProductDetailsBC
) => {
  console.log("IN CONTEXT:", product);
  const response = await contract.update_product({
    args: {
      id: product.id,
      store_account_id: product.store_account_id,
      description: product.description,
      media_url: product.media_url,
      name: product.name,
      price: product.price,
    },
    gas: ATTACHED_GAS,
    meta: "update_product",
  });
  return response;
};

export const list_store_products = async (
  contract: any,
  store_id: any,
  currentAccountId: any
) => {
  const response = await contract.list_store_products({
    account_id: currentAccountId,
    id: store_id,
  });
  return response;
};

// TODO: Create a Order
// {
//   "id": "order-1",
//   "customer_account_id": "clifford.test.near",
//   "store_account_id": "fabrics-delivery.test.near",
//   "status": "PENDING",
//   "payload": {
//       "token": "usdt.test.near",
//       "amount": "50000000",
//       "line_items": [
//           {
//               "count": 1,
//               "product_id": "product-1"
//           },
//           {
//               "count": 1,
//               "product_id": "product-2"
//           }
//       ]
//   }
// }

export type Order = {
  id: string;
  customer_account_id: string;
  store_account_id: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  payload: {
    token: string;
    amount: string;
    line_items: Array<{
      count: number;
      product_id: string;
    }>;
  };
};

export const create_order = async (usdtContract: any, recipient: string, order: Order) => {
  const response = await usdtContract.ft_transfer_call({
    args: {
      receiver_id: recipient,
      amount: order.payload.amount.toString(),
      memo: order.id,
      msg: JSON.stringify({ ...order, id: order.id }),
    },
    gas: ATTACHED_GAS, // attached GAS (optional)
    amount: YOCTO_NEAR, // attached deposit in yoctoNEAR (optional)
  });
  console.log("response from create order!!", response);
  return response;
};

// TODO: Schedule a Order

// TODO: Cancel a Order
//


let initObject = {
  cart: Array<ProductDetails>(),
  marketplace: {
    stores: Array<StoreDetails>(),
    products: Array<ProductDetails>(),
  },
  mydetails: {
    balance: 0,
  },
  setCart: (v: any) => {},
  setMarketplace: (v: any) => {},
};

const GlobalContext = createContext(initObject);

export const GlobalContextWrapper = ({ children }: any) => {
  const [cart, setCart] = useState<Array<ProductDetails>>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceProps>({
    products: [],
    stores: [],
    selfStore: undefined,
  });
  const [myDetails, setMyDetails] = useState<{balance: number}>({
    balance: 0
  });

  const { walletConnection, contract, currentUser, usdtContract } =
    useWalletContext();

  // Prefilling with Fake Data
  useEffect(() => {
    (async () => {
      // let cres = await create_store(contract, {...sampleStore});
      // console.log(cres);
      let store_data = await retrieve_store(
        contract,
        currentUser?.accountId,
        currentUser?.accountId
      );
      console.log(store_data);

      let stores = await contract?.list_stores({
        account_id: currentUser?.accountId,
      });
      console.log(stores);

      // Get Products for starting 5 stores
      // TODO: Handle Responses type back.
      let products: any = [];
      if (stores !== null) {
        let len = stores.length > 5 ? 5 : stores.length;
        for (let i = 0; i < len; ++i) {
          const prods = await list_store_products(
            contract,
            stores[i].id,
            currentUser?.accountId
          );
          products = [...products, ...prods];
        }
      }

      // Load my Products if any
      let myProducts = await list_store_products(
        contract,
        currentUser?.accountId,
        currentUser?.accountId
      );

      //Check my usdt Balance
      const response = await usdtContract?.ft_balance_of({
        account_id: currentUser?.accountId, // argument name and value - pass empty object if no args required
      });
      console.log("USDT Balance: ", response / 10**8 );
      if(response !== null || response!== undefined) {
        setMyDetails({
          ...myDetails,
          balance: response / 10**8
        });
      }

      setMarketplace({
        ...marketplace,
        stores: [...stores],
        products: [...products],
        selfStore: store_data,
        selfProducts: [...myProducts],
      });
    })();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        cart: cart,
        marketplace: marketplace,
        setCart: setCart,
        setMarketplace: setMarketplace,
        mydetails: myDetails
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
