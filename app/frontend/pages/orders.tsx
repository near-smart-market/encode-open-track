import {
  get_store_orders,
  get_user_orders,
  useGlobalContext,
} from "../context/appContext";
import { useWalletContext } from "../context/walletContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
const Orders = () => {
  const { contract, currentUser } = useWalletContext();
  const {
    marketplace: { selfStore },
    setMarketplace,
  } = useGlobalContext();

  const [sorders, setSOrders] = useState<any>([]);
  const [uorders, setUOrders] = useState<any>([]);

  useEffect(() => {
    (async () => {
      // Get All Orders if current Store is there.

      // Since store will have same id as account id
      const orders = await get_store_orders(
        contract,
        currentUser?.accountId,
        currentUser?.accountId
      );
      //   console.log(orders);
      setSOrders([...orders]);

      // Get All Order which this user have placed on stores.

      let uOrders = await get_user_orders(contract, currentUser?.accountId);
      setUOrders([...uOrders]);
    })();
  }, []);

  useEffect(() => {
    console.log(sorders, uorders);
  }, [sorders, uorders]);

  return (
    <div className="min-h-screen flex flex-col justify-start align-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold my-3">Orders</h1>
        {selfStore ? (
          <div className="container">
            <p className="text-xl font-bold">Your Store Orders:</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 my-2">
              {sorders.length > 0 ? (
                sorders.map((order: any) => {
                  return (
                    <div
                      key={order.id}
                      className="shadow-sm shadow-black p-3 flex flex-col justify-center items-center"
                    >
                      {/* <p>{JSON.stringify(order)}</p> */}
                      {/* <Image src={order.media_url} width={300} height={300} /> */}
                      <p className="text-xl font-bold">
                        Product ID: {order.id}
                      </p>
                      <p className="text-xl font-bold">Name: {order.name}</p>
                      <p className="text-xl">
                        Description: {order.description}
                      </p>
                      <p className="text-xl font-bold">
                        Price: {order.price / 10 ** 8} NEAR-SMT
                      </p>
                    </div>
                  );
                })
              ) : (
                <p>No Orders Yet recieved for your store.</p>
              )}
            </div>
          </div>
        ) : (
          <p>
            Uh Oh! Looks like you haven't created your store yet. Create one
            from Edit Tab.
          </p>
        )}
        <div className="container mt-3">
          <p className="text-xl font-bold">Your Orders</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 my-2">
            {uorders.length > 0 ? (
              uorders.map((order: any) => {
                return (
                  <div
                    key={order.id}
                    className="shadow-sm shadow-black p-3 flex flex-col justify-center items-center"
                  >
                    {/* <p>{JSON.stringify(order)}</p> */}
                    {/* <Image src={order.media_url} width={300} height={300} /> */}
                    <p className="text-xl font-bold">Product ID: {order.id}</p>
                    <p className="text-xl font-bold">Name: {order.name}</p>
                    <p className="text-xl">Description: {order.description}</p>
                    <p className="text-xl font-bold">
                      Price: {order.price / 10 ** 8} NEAR-SMT
                    </p>
                  </div>
                );
              })
            ) : (
              <p>
                Uh Oh! Looks like you haven't Ordered Anything Yet. You can
                place New Order by Visiting{" "}
                <span className="text-blue-700">
                  <Link href="/">Marketplace</Link>
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
