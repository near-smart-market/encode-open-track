import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ProductCard from "../../components/product_card";
import {
  list_store_products,
  useGlobalContext,
} from "../../context/appContext";
import { useWalletContext } from "../../context/walletContext";

const StoreView = () => {
  const router = useRouter();
  const { store_id } = router.query;

  const { contract, currentUser } = useWalletContext();
  const {
    setCart,
    cart
  } = useGlobalContext();

  const [store_products, setStoreProducts] = useState<Array<any>>([]);

  const handleCartAdd = (id: any) => {
    console.log(id);
    const product = store_products.filter((product) => product.id === id)[0];
    console.log(product);
    setCart([...cart, product]);
  };

  useEffect(() => {
    (async () => {
      const products = await list_store_products(
        contract,
        store_id,
        currentUser?.accountId
      );
      console.log(products);
      setStoreProducts([...products]);
    })();
  }, [contract]);


  return (
    <div className="min-h-screen flex justify-center align-center">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 p-2">
        {store_products.map((product) => {
          return (
            <ProductCard
              key={product.id + product.name}
              id={product.id}
              name={product.name}
              price={product.price}
              currency={"NEAR-SMT"}
              description={product.description}
              media_url={product.media_url}
              store_account_id={product.store_account_id}
              handleCartAdd={handleCartAdd} inventory={0}
              slides={[]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StoreView;
