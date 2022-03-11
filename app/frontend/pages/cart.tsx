import React, { useEffect, useState } from "react";
import type { NextPage } from "next";

import { create_order, Order, useGlobalContext } from "../context/appContext";
import { useWalletContext } from "../context/walletContext";
import Link from "next/link";

const Cart: NextPage = () => {
  const { cart, setCart, mydetails } = useGlobalContext();

  const { usdtContract, currentUser, contract } = useWalletContext();

  const handleRemove = (id: string) => {
    const newCart = cart.filter((prod) => prod.id !== id);
    setCart([...newCart]);
  };

  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(
      cart.reduce(
        (prev, next) => {
          return {
            price: parseFloat(prev.price.toString()) + next.price,
          };
        },
        { price: 0.0 }
      ).price /
        10 ** 8
    );
  }, [cart]);

  const handleBuy = async () => {
    console.log("Now Handle Buy");
    if (total > mydetails.balance) {
      alert("You don't have enough NEAR-SMT to place a purchase order.");
      return;
    }
    // Get All Products
    let shops: any = [];
    let orderItemsMap: any = {};
    cart.map((prod) => {
      !shops.includes(prod.store_account_id) &&
        shops.push(prod.store_account_id);
      if (orderItemsMap[prod.store_account_id]) {
        orderItemsMap[prod.store_account_id] = [
          ...orderItemsMap[prod.store_account_id],
          prod,
        ];
      } else {
        orderItemsMap[prod.store_account_id] = [prod];
      }
    });
    console.log(shops);
    console.log(orderItemsMap);
    // Create Order
    let orders: Array<Order> = [];
    shops.map((shop: any) => {
      orders.push({
        id: `${shop}-${parseInt((Math.random() * 10000).toString())}`,
        customer_account_id: currentUser ? currentUser.accountId : "",
        store_account_id: shop,
        status: "PENDING",
        payload: {
          token: "NEAR-SMT",
          amount: (total * 10 ** 8).toString(),
          line_items: orderItemsMap[shop].map((prod: any) => {
            return { count: 1, product_id: prod.id };
          }),
        },
      });
    });
    console.log(orders);
    // Call Function on usdtContract
    orders.forEach(async (order) => {
      alert(order.id);
      const response = await create_order(
        usdtContract,
        contract?.contractId as any,
        order
      );
      console.log(response);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-4 pb-4">
      <p className="text-4xl font-bold mb-3">Cart</p>

      {cart.length > 0 ? (
        <div className="flex flex-col w-4/5">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow-md sm:rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Description
                      </th>

                      <th
                        scope="col"
                        className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Price
                      </th>
                      <th scope="col" className="relative py-3 px-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((product) => {
                      return (
                        <tr
                          className="border-b odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 dark:border-gray-600"
                          key={product.id + product.name}
                        >
                          <td className="py-4 px-6 text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white flex">
                            <img
                              src={product.media_url}
                              alt={product.name}
                              className="w-6 h-6 mr-2"
                            ></img>
                            <span className="z-75 px-3 rounded">
                              {product.name}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm truncate text-gray-500 whitespace-nowrap dark:text-gray-400 max-w-sm">
                            {product.description}
                          </td>

                          <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-100">
                            {product.price / 10 ** 8}{" "}
                            {product.currency || "NEAR-SMT"}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                            <button
                              className="text-blue-600 dark:text-blue-500 hover:underline"
                              onClick={() => handleRemove(product.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>
          Uh Oh! Cart is empty try adding something from the{" "}
          <span className="text-blue-700">
            <Link href="/">Marketplace</Link>
          </span>
        </p>
      )}

      {cart.length >= 1 && (
        <div className="w-4/5 flex flex-col justify-end items-end">
          <p className="text-right font-bold text-xl">
            Total Amount: {total} {cart[0].currency || "NEAR-SMT"}
          </p>
          <button
            className="text-white bg-gray-900 rounded p-3 mt-3"
            onClick={handleBuy}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
