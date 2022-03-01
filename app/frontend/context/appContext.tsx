import { createContext, useContext, useState, useEffect } from "react";
import { ProductDetails } from "../components/product_card";
import { getProduct } from "../utils/fakeData";

export type MarketplaceProps = {
  products: Array<ProductDetails>;
};

let initObject = {
  cart: Array<ProductDetails>(),
  marketplace: {
    products: Array<ProductDetails>()
  },
  setCart: (v: any) => {},
  setMarketplace: (v: any) => {}
}

const GlobalContext = createContext(initObject);

export const GlobalContextWrapper = ({ children }: any) => {
  const [cart, setCart] = useState<Array<ProductDetails>>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceProps>({
    products: [],
  });

  // Prefilling with Fake Data
  useEffect(() => {
    const prods: ProductDetails[] = [];

    for (let i = 0; i < 10; ++i) {
      prods.push(getProduct());
    }

    setMarketplace({
      ...marketplace,
      products: [...marketplace.products, ...prods],
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        cart: cart,
        marketplace: marketplace,
        setCart: setCart,
        setMarketplace: setMarketplace,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
}
