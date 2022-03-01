import React, { useContext } from "react";
import { Slide } from "./image_slider";
import ProductCard from "./product_card";

import { getProduct } from "../utils/fakeData";
import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks";
import { addProduct as addToCart } from "../slices/cart";
import { useGlobalContext } from "../context/appContext";

const Products = () => {
  const {
    marketplace: { products },
    cart,
    setCart,
  } = useGlobalContext();

  const handleCartAdd = (id: any) => {
    console.log(id);
    const product = products.filter((product) => product.id === id)[0];
    console.log(product);
    setCart([...cart, product]);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 p-2">
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id + product.name}
            id={product.id}
            name={product.name}
            inventory={product.inventory}
            price={product.price}
            currency={product.currency}
            slides={product.slides}
            description={product.description}
            handleCartAdd={handleCartAdd}
          />
        );
      })}
    </div>
  );
};

export default Products;
