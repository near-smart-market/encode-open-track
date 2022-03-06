import React from "react";
import { ProductDetailsBC } from "../components/product_card";

import { useGlobalContext, create_product } from "../context/appContext";
import { useWalletContext } from "../context/walletContext";

import EditProduct from "../components/editProduct";

const Add = () => {
  const {
    marketplace: { selfStore, selfProducts },
  } = useGlobalContext();
  const { currentUser, contract } = useWalletContext();

  React.useEffect(() => {
    if (selfStore) {
      setProduct({
        ...product,
        sid: selfStore.id,
      });
    }
  }, [selfStore]);

  const [product, setProduct] = React.useState({
    pid: "",
    sid: "",
    pname: "",
    pdesc: "",
    pprice: "",
    pmedia: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(product);
    let finalProduct: ProductDetailsBC = {
      description: product.pdesc,
      id: product.pid,
      store_account_id: product.sid,
      // Since USDT has 8 decimals so multiplying by 10^8
      price: parseInt((parseFloat(product.pprice) * 10 ** 8).toString()),
      media_url: product.pmedia,
      name: product.pname,
    };
    console.log(finalProduct);
    create_product(contract, finalProduct);
  };

  const handleChange = (e: any) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-start align-center">
      <div className="flex justify-start align-center">
        {selfStore && (
          <div className="container p-3 flex flex-col justify-start items-center shadow-sm shadow-black m-3">
            <h3 className="font-bold text-2xl text-center mb-3 mt-4">
              Shop Details
            </h3>
            <div className="w-4/5 my-5">
              <form>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    name="sname"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={selfStore.name}
                    disabled
                    // required
                    // onChange={(e) => handleChange(e)}
                  />
                  <label
                    htmlFor="sname"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Name
                  </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="number"
                    name="lat"
                    id="lat"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={selfStore.lat_lng.latitude}
                    disabled
                    // required
                    // onChange={(e) => handleChange(e)}
                  />
                  <label
                    htmlFor="lat"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Latitude
                  </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="number"
                    name="lng"
                    id="lng"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={selfStore.lat_lng.longitude}
                    disabled
                    // required
                    // onChange={(e) => handleChange(e)}
                  />
                  <label
                    htmlFor="lng"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Longitude
                  </label>
                </div>
                <div className="grid xl:grid-cols-1 xl:gap-0">
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="text"
                      name="saddr"
                      id="saddr"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      value={selfStore.address}
                      disabled
                      // required
                      // onChange={(e) => handleChange(e)}
                    />
                    <label
                      htmlFor="saddr"
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Address
                    </label>
                  </div>
                </div>

                {/* <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Edit Store Details
              </button> */}
              </form>
            </div>
          </div>
        )}

        <div className="container p-3 flex flex-col justify-start items-center shadow-sm shadow-black m-3">
          <h3 className="font-bold text-2xl text-center mb-3">Add a Product</h3>
          <div className="w-4/5 my-5">
            <form onSubmit={handleSubmit}>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="id"
                  name="pid"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.pid}
                  required
                  onChange={(e) => handleChange(e)}
                />
                <label
                  htmlFor="pid"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Product Id
                </label>
              </div>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="sid"
                  id="sid"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.sid}
                  required
                  onChange={(e) => handleChange(e)}
                />
                <label
                  htmlFor="sid"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Store Account ID
                </label>
              </div>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="pname"
                  id="pname"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.pname}
                  required
                  onChange={(e) => handleChange(e)}
                />
                <label
                  htmlFor="pname"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Product Name
                </label>
              </div>
              <div className="grid xl:grid-cols-1 xl:gap-0">
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    name="pdesc"
                    id="pdesc"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={product.pdesc}
                    required
                    onChange={(e) => handleChange(e)}
                  />
                  <label
                    htmlFor="pdesc"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Product Description
                  </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="number"
                    name="pprice"
                    id="pprice"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={product.pprice}
                    required
                    onChange={(e) => handleChange(e)}
                  />
                  <label
                    htmlFor="pprice"
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
                    name="pmedia"
                    id="pmedia"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={product.pmedia}
                    required
                    onChange={(e) => handleChange(e)}
                  />
                  <label
                    htmlFor="pmedia"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Product Media URL
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add Product to your Store
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xl font-bold">Edit Individual Products</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1">
          {selfProducts &&
            selfProducts.map((product: ProductDetailsBC) => {
              return <EditProduct product={product} key={product.id} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Add;
