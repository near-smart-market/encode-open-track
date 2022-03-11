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

// const sampleStore = {
//   id: "prix.testnet",
//   address: "Toronto, Canada",
//   name: "Fabrics Delivery Store",
//   lat_lng: {
//     latitude: 43.65107,
//     longitude: -79.347015,
//   },
// };

export const create_store = async (contract: any, store: any) => {
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
      product_id: product.id,
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
  console.log("list_store_products", contract, store_id, currentAccountId);
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
  status: "SCHEDULED" | "PENDING" | "COMPLETED" | "CANCELLED";
  payload: {
    token: string;
    amount: string;
    line_items: Array<{
      count: number;
      product_id: string;
    }>;
  };
};

export const create_order = async (
  usdtContract: any,
  recipient: string,
  order: Order
) => {
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

// TODO: Get Store Orders

export const get_store_orders = async (
  contract: any,
  accountId: any,
  store_account_id: any
) => {
  const response = await contract.list_store_orders({
    account_id: accountId,
    store_account_id: store_account_id,
  });
  // console.log("response", response);
  return response;
};

// GET User Orders
export const get_user_orders = async (contract: any, accountId: any) => {
  const response = await contract.list_customer_orders({
    account_id: accountId,
    customer_account_id: accountId,
  });
  return response;
};

// Retrieve a Order
export const retrieve_order = async (
  contract: any,
  accountId: any,
  orderId: any
) => {
  const response = await contract.retrieve_order({
    account_id: accountId,
    order_id: orderId,
  });
  console.log("response", response);
  return response;
};

// TODO: Schedule a Order
export const schedule_order = async (
  contract: any,
  store_account_id: any,
  orderId: any
) => {
  const response = await contract.schedule_order({
    args: {
      store_account_id: store_account_id,
      order_id: `${store_account_id}:${orderId}`,
    },
    gas: ATTACHED_GAS,
    amount: "1",
    meta: "schedule_order",
  });
  console.log("response", { response });
  return response;
};

// Complete an Order
export const complete_order = async (
  contract: any,
  store_account_id: any,
  orderId: any
) => {
  const response = await contract.complete_order({
    args: {
      store_account_id: store_account_id,
      order_id: `${store_account_id}:${orderId}`,
    },
    gas: ATTACHED_GAS,
    amount: "1",
    meta: "complete_order",
  });
  console.log("response", { response });
  return response;
};

// Cancel a Order
export const cancel_order = async (
  contract: any,
  store_account_id: any,
  orderId: any
) => {
  const response = await contract.cancel_order({
    args: {
      store_account_id: store_account_id,
      order_id: `${store_account_id}:${orderId}`,
    },
    gas: ATTACHED_GAS,
    amount: "1",
    meta: "cancel_order",
  });
  console.log("response", { response });
  return response;
};

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
  const [myDetails, setMyDetails] = useState<{ balance: number }>({
    balance: 0,
  });

  const { walletConnection, contract, currentUser, usdtContract } =
    useWalletContext();

  useEffect(() => {
    (async () => {
      // let cres = await retrieve_order(contract, currentUser?.accountId, "prix.testnet-7264");
      // console.log(cres);

      let store_data = null;
      try {
        store_data = await retrieve_store(
          contract,
          currentUser?.accountId,
          currentUser?.accountId
        );
      } catch (e) {
        console.log(
          "Looks like you don't have a store yet. Do create one to list any products"
        );
      }

      console.log(store_data);

      let stores = await contract?.list_stores({
        account_id: currentUser?.accountId,
      });
      // console.log(stores);

      // Get Products for starting 5 stores
      // TODO: Handle Responses type back.
      let products: any = [];
      if (stores.length) {
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
      let myProducts: any = [];
      try {
        myProducts = await list_store_products(
          contract,
          currentUser?.accountId,
          currentUser?.accountId
        );
      } catch (e) {
        console.log(e);
      }

      //Check my usdt Balance
      const response = await usdtContract?.ft_balance_of({
        account_id: currentUser?.accountId, // argument name and value - pass empty object if no args required
      });
      console.log("NEAR-SMT: ", response / 10 ** 8);
      if (response !== null || response !== undefined) {
        setMyDetails({
          ...myDetails,
          balance: response / 10 ** 8,
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
        mydetails: myDetails,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
