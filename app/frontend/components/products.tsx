import React from "react";
import { Slide } from "./image_slider";
import ProductCard from "./product_card";

import { getProduct } from "../utils/fakeData";
import { useState, useEffect } from "react";

const Products = () => {
  const [products, setProducts] = useState<Array<any>>([]);

  useEffect(() => {
    const prods = [];

    for (let i = 0; i < 10; ++i) {
      prods.push(getProduct());
    }
    setProducts(prods);
  }, []);

  const slides: Array<Slide> = [
    {
      img: "https://picsum.photos/300/400",
      title: "Image 1",
      body: "This is Image 1",
    },
    {
      img: "https://picsum.photos/300/300",
      title: "Image 2",
      body: "This is Image 2",
    },
    {
      img: "https://picsum.photos/300/500",
      title: "Image 3",
      body: "This is Image 3",
    },
  ];

  const handleCartAdd = (id: any) => {
    console.log(id);
  };
  return (
    <div className="grid gap-4 grid-cols-3">
        {
            products.map((product) => {
                return <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    inventory={product.inventory}
                    price={product.price}
                    currency={product.currency}
                    slides={product.slides}
                    description={product.description}
                    handleCartAdd={handleCartAdd}
                />
            })
        }
      
    </div>
  );
};

export default Products;
