import ImageSlider from "./image_slider";
import { Slide } from "./image_slider";
import { FC } from "react";
import ShoppingCart from "../icons/shopping_cart";
import Icon from "@mdi/react";
import { mdiCartOutline, mdiCheck } from "@mdi/js";
import { useGlobalContext } from "../context/appContext";

export type ProductDetailsBC = {
  id: any;
  name: string;
  price: number;
  store_account_id: string;
  description: string;
  media_url: string;
};

export type ProductDetails = ProductDetailsBC & {
  currency?: string;
  inventory?: number;
  slides?: Array<Slide>;
};

export type Props = ProductDetails & {
  handleCartAdd?: (id: any) => any;
};

const ProductCard: FC<Props> = ({
  id,
  name,
  price,
  store_account_id,
  media_url,
  currency,
  inventory,
  slides,
  description,
  handleCartAdd,
}) => {
  const { cart } = useGlobalContext();

  const isInCart = (id: string) => {
    const sres = cart.filter((prod) => prod.id === id);
    return !(sres.length > 0);
  };

  return (
    <div className="bg-grey-light py-8 w-full flex justify-center items-start top-0">
      <div className="bg-white rounded  shadow hover:shadow-md duration-4">
        <div className="flex flex-col justify-between uppercase font-bold text-blue-dark border-b p-6">
          <p>{name}</p>
          <p className="text-sm lowercase text-blue-700">
            Offered by: {store_account_id}
          </p>
        </div>

        <ImageSlider slides={slides} media_url={media_url} />
        <div className="p-6 text-grey-darker text-justify flex flex-col">
          <div className="pt-4">
            <span className="uppercase bg-blue-500 text-white font-bold p-2 text-xs shadow rounded">
              {price / 10 ** 8} {currency}
            </span>
            {/* {inventory && (
              <span className="uppercase bg-yellow-800 text-gray-100 font-bold ml-2 p-2 text-xs shadow rounded">
                stock: {inventory}
              </span>
            )} */}
          </div>
          <p className="text-gray-900 mt-4">{description}</p>
        </div>
        {handleCartAdd &&
          (isInCart(id) ? (
            <div className="p-6 text-grey-darker text-justify flex flex-row justify-end border-t">
              <button
                className="uppercase self-end bg-green-700 font-bold text-white px-6 py-4 rounded hover:bg-green-900 transition ease-in-out delay-15 duration-4 flex"
                onClick={() => handleCartAdd(id)}
              >
                <Icon path={mdiCartOutline} size={1} />
                Add to cart
              </button>
            </div>
          ) : (
            <div className="p-6 text-grey-darker text-justify flex flex-row justify-end border-t">
              <button className="uppercase self-end bg-blue-700 font-bold text-white px-6 py-4 rounded hover:bg-blue-900 transition ease-in-out delay-15 duration-4 flex">
                <Icon path={mdiCheck} size={1} />
                Added to Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductCard;
