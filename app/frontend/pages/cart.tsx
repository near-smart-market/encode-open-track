import React, { useEffect } from "react";
import type { NextPage } from "next";

import { useAppSelector, useAppDispatch } from "../hooks";

const Cart: NextPage = () => {
  const products = useAppSelector((state) => state.products.products);
  const dispatch = useAppDispatch();

  console.log(products);
  return (
    <div className="min-h-screen flex flex-col items-center pt-4 pb-4">
      <p className="text-2xl">Cart</p>
      <table className="table-fixed">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
            {products.map((product) => {
           return <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price} {product.currency}</td>
            </tr>
        })}
          <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
          </tr>
          <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
          </tr>
          <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
          </tr>
        </tbody>
      </table>
      
    </div>
  );
};

export default Cart;
