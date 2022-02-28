import { useAppSelector } from "../hooks";
import ProductCard from "../components/product_card";

const View = () => {
  const marketPlaceProducts = useAppSelector(
    (state) => state.marketplace.products
  );
  return (
    <div className="min-h-screen px-3">
      <h2 className="text-3xl font-bold text-center my-5">Your Products</h2>
      <p className="text-center">
        This page lists all the stores and products you have.{" "}
      </p>
      <div className="w-full flex flex-col justify-center items-center py-5 shadow-sm  my-2 border-2 rounded">
        <p className="text-xl font-bold">Store ID: maximumpoer.near</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 p-2 w-4/5">
          {marketPlaceProducts.filter((_) => Math.random() > 0.5).map((product) => {
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
              />
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center py-5 shadow-sm  my-2  border-2 rounded">
        <p className="text-xl font-bold">Store ID: neopolis.near</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 p-2 w-4/5">
          {marketPlaceProducts.filter((_) => Math.random() > 0.5).map((product) => {
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
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default View;
