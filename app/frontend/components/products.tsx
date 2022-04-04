import React from "react";
import ProductCard from "./product_card";

import { useGlobalContext } from "../context/appContext";
import Link from "next/link";

const NoStores = () => {
  return <div className="flex justify-center flex-col items-center">
    <p>Uh Oh!. No Stores yet. </p>
    <p>But you know what's great, You can create one yourself. Click on <span className="text-blue-700"><Link href="/edit" >Edit</Link></span> to create a new Store.</p>
  </div>
}

const Products = () => {
  const {
    marketplace: { products, stores },
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
    <div className="container">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 p-2">
        {products.filter(p => p).map((product) => {
          return (
            <ProductCard
              key={product.id + product.name}
              id={product.id}
              name={product.name}
              inventory={product.inventory}
              price={product.price}
              currency={"NEAR-SMT"}
              slides={product.slides}
              description={product.description}
              media_url={product.media_url}
              store_account_id={product.store_account_id}
              handleCartAdd={handleCartAdd}
            />
          );
        })}
      </div>
      {stores.length > 0 ? <div>
        <p className="mt-5 mb-3 text-3xl ml-4"> Stores</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 p-4">
          {stores.map((store, index) => {
            return (
              <div
                className="max-w-xs rounded overflow-hidden shadow-lg my-2"
                key={store.id}
              >
                <img
                  className="w-full"
                  src={`https://picsum.photos/150/150?random=${index}`}
                  alt="Sunset in the mountains"
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{store.name}</div>
                  <span className="flex justify-start items-center">
                    <p className="font-bold text-blue-600 text-xl mr-3">
                      Store ID:{" "}
                    </p>
                    <p className="text-grey-900 text-base">{store.id}</p>
                  </span>
                </div>
                <div className=" m-2 bg-gray-600 text-white p-3 rounded flex justify-between hover:bg-gray-900 transition-all">
                  <Link href={`/store/${store.id}`}>View Store Products</Link>
                </div>
                <div className="px-6 py-4">
                  <p>Coordinates to visit: </p>
                  <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">
                    Lat: {store.lat_lng.latitude}
                  </span>
                  <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">
                    Long: {store.lat_lng.longitude}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div> : <NoStores />}
    </div>
  );
};

export default Products;
