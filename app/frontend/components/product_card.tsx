import ImageSlider from "./image_slider";
import  { Slide } from "./image_slider";
import { FC } from "react";
import ShoppingCart from "../icons/shopping_cart";
import Icon from '@mdi/react'
import { mdiCartOutline } from '@mdi/js'

export type ProductDetails = {
  id: any,
  name: string, 
  price: string,
  currency: string,
  inventory: number,
  description: string,
  slides: Array<Slide>,
  handleCartAdd: (id: any) => any,
}

const ProductCard: FC<ProductDetails> = ({
  id,
  name,
  price,
  currency,
  inventory,
  slides,
  description,
  handleCartAdd
}) => {
  return (
    <div className="bg-grey-light py-8 w-full flex justify-center items-start top-0">
      <div className="bg-white rounded  shadow hover:shadow-md duration-4">
        <div className="flex flex-row justify-between uppercase font-bold text-blue-dark border-b p-6">
          <p>{name}</p>
          <div className="cursor-pointer text-grey-dark hover:text-blue duration-4">
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>
        <ImageSlider slides={slides} />
        <div className="p-6 text-grey-darker text-justify flex flex-col">
          <div className="pt-4">
            <span className="uppercase bg-blue-500 text-white font-bold p-2 text-xs shadow rounded">
              {price} {currency}
            </span>
            <span className="uppercase bg-yellow-800 text-gray-100 font-bold ml-2 p-2 text-xs shadow rounded">
              stock: {inventory}
            </span>
          </div>
          <p className="text-gray-900 mt-4">{description}</p>
        </div>
        <div className="p-6 text-grey-darker text-justify flex flex-row justify-end border-t">
          <button className="uppercase self-end bg-green-700 font-bold text-white px-6 py-4 rounded hover:bg-green-900 transition ease-in-out delay-15 duration-4 flex" onClick={() => handleCartAdd(id)}>
            <Icon path={mdiCartOutline}  size={1}/>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
