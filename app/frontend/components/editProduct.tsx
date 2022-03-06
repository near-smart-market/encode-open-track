import { FC, useEffect, useState } from "react";
import { update_product } from "../context/appContext";
import { useWalletContext } from "../context/walletContext";
import { ProductDetails, ProductDetailsBC } from "./product_card";

type Props = {
  product: ProductDetailsBC;
};

const EditProduct: FC<Props> = ({ product }) => {
  const [lproduct, setLProduct] = useState<any>();
  const [mod, setMod] = useState(false);
  const { contract} = useWalletContext();

  useEffect(() => {
    setLProduct({ ...product, price: product.price / 10**8 });
  }, [product]);

  useEffect(() => {
    
    if (JSON.stringify(product) !== JSON.stringify(lproduct)) {
      setMod(true);
    }
  });

  const handleChange = (e: any) => {
    setLProduct({
      ...lproduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const finalProduct = {
        ...lproduct,
        price: lproduct.price * 10**8
    }
    console.log(finalProduct);
    let response = update_product(contract, finalProduct);
    console.log("FINAL RESPONSE:", response);
  };

  return lproduct ? (
    <form
      onSubmit={handleUpdate}
      className="p-3 shadow-sm shadow-black m-2 pt-5"
    >
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="id"
          name="id"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={lproduct.id}
          required
          onChange={(e) => handleChange(e)}
        />
        <label
          htmlFor="id"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Id
        </label>
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          name="store_account_id"
          id="store_account_id"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={lproduct.store_account_id}
          required
          onChange={(e) => handleChange(e)}
        />
        <label
          htmlFor="store_account_id"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Store Account ID
        </label>
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          name="name"
          id="name"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={lproduct.name}
          required
          onChange={(e) => handleChange(e)}
        />
        <label
          htmlFor="name"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Name
        </label>
      </div>
      <div className="grid xl:grid-cols-1 xl:gap-0">
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="description"
            id="description"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={lproduct.description}
            required
            onChange={(e) => handleChange(e)}
          />
          <label
            htmlFor="description"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Product Description
          </label>
        </div>
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="number"
            name="price"
            id="price"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={lproduct.price}
            required
            onChange={(e) => handleChange(e)}
          />
          <label
            htmlFor="price"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Product Price (in USD)
          </label>
        </div>
      </div>
      <div className="grid xl:grid-cols-2 xl:gap-6">
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="media_url"
            id="media_url"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={lproduct.media_url}
            required
            onChange={(e) => handleChange(e)}
          />
          <label
            htmlFor="media_url"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Product Media URL
          </label>
        </div>
      </div>
      {mod && (
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update the product in Store
        </button>
      )}
    </form>
  ) : (
    <p>Loading...</p>
  );
};

export default EditProduct;
