import {
  cancel_order,
  complete_order,
  get_store_orders,
  get_user_orders,
  schedule_order,
  useGlobalContext,
} from "../context/appContext";
import { useWalletContext } from "../context/walletContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/button";

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

  const getStatus = (tag: string) => {
    switch (tag) {
      case "PENDING":
        return (
          <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full">
            <p>Pending</p>
          </div>
        );
        break;
      case "SCHEDULED":
        return (
          <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
            <p>Scheduled</p>
          </div>
        );
        break;
      case "COMPLETED":
        return (
          <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-green-200 text-green-700 rounded-full">
            <p>Completed</p>
          </div>
        );
        break;
      case "CANCELLED":
        return (
          <div className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-red-200 text-red-700 rounded-full">
            <p>Cancelled</p>
          </div>
        );
        break;
    }
  };

  const schedule = async (orderId: string) => {
    console.log(orderId);
    await schedule_order(contract, currentUser?.accountId, orderId);
  }

  const complete = async (orderId: string) => {
    await complete_order(contract, currentUser?.accountId, orderId);
  }

  const cancel = async (orderId: string) => {
    await cancel_order(contract, currentUser?.accountId, orderId);
  }

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
                      <p className="text-xl font-bold">Order ID: {order.id}</p>
                      <p className="text-xl font-bold">
                        Buyer: {order.customer_account_id}
                      </p>
                      <p className="text-xl">Description</p>
                      <div className="flex justify-between w-full">
                        <p className="font-bold">Product ID</p>
                        <p className="font-bold">Count</p>
                      </div>
                      {order.payload.line_items.map((item: any) => {
                        return (
                          <div className="flex justify-between w-full">
                            <p>{item.product_id}</p>
                            <p>{item.count}</p>
                          </div>
                        );
                      })}
                      <p className="text-xl font-bold">
                        Price: {order.payload.amount / 10 ** 8} NEAR-SMT
                      </p>
                      <p>Status: {getStatus(order.status)}</p>
                      <div className="w-full">
                        <p className="text-xl font-bold">Actions</p>
                        <div className="flex justify-between flex-wrap w-full py-3">
                          {
                            order.status == "PENDING" && order.store_account_id == contract?.account.accountId &&
                            <Button type="INFO" onClick={() => schedule(order.id)}>
                              <p>Schedule</p>
                            </Button>
                          }
                          {
                            order.status == "SCHEDULED" && order.store_account_id == contract?.account.accountId &&
                            <Button type="SUCCESS" onClick={() => complete(order.id)}>
                              <p>Complete</p>
                            </Button>
                          }
                          {
                            ["COMPLETED", "CANCELLED"].every(status => status != order.status) && 
                            <Button type="DANGER" onClick={() => cancel(order.id)}>
                              <p>Cancel</p>
                            </Button>
                          }

                        </div>
                      </div>
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
                    <p className="text-xl font-bold">Order ID: {order.id}</p>
                    <p className="text-xl font-bold">
                      Invoiced to: {order.customer_account_id}
                    </p>
                    <p className="text-xl">Description</p>
                    <div className="flex justify-between w-full">
                      <p className="font-bold">Product ID</p>
                      <p className="font-bold">Count</p>
                    </div>
                    {order.payload.line_items.map((item: any) => {
                      return (
                        <div className="flex justify-between w-full">
                          <p>{item.product_id}</p>
                          <p>{item.count}</p>
                        </div>
                      );
                    })}
                    <p className="text-xl font-bold">
                      Price: {order.payload.amount / 10 ** 8} NEAR-SMT
                    </p>
                    <p>Status: {getStatus(order.status)}</p>
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
