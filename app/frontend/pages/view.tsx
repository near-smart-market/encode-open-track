import { useAppSelector } from "../hooks";
import ProductCard from "../components/product_card";
import { useGlobalContext } from "../context/appContext";
import { useWalletContext } from "../context/walletContext";

const View = () => {
  const {
    marketplace: { selfProducts },
  } = useGlobalContext();
  const { currentUser } = useWalletContext();
  return (
    <div className="min-h-screen px-3">
      <h2 className="text-3xl font-bold text-center my-5">Your Products</h2>
      <p className="text-center">
        This page lists all the stores and products you have.{" "}
      </p>
      <div className="w-full flex flex-col justify-center items-center py-5 shadow-sm  my-2 border-2 rounded">
        <p className="text-xl font-bold">Store ID: {currentUser?.accountId}</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 p-2 w-4/5">
          {selfProducts && selfProducts.map((product) => {
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
                store_account_id={product.store_account_id}
                media_url={product.media_url}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default View;
