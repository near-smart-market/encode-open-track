import ImageSlider from "./image_slider";
import  { Slide } from "./image_slider";

const ProductCard = () => {
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

  return (
    <div className="bg-grey-light py-8 w-full flex justify-center items-center">
      <div className="bg-white rounded  shadow hover:shadow-md duration-4">
        <div className="flex flex-row justify-between uppercase font-bold text-blue-dark border-b p-6">
          <p>Product Name</p>
          <div className="cursor-pointer text-grey-dark hover:text-blue duration-4">
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>
        <ImageSlider slides={slides} />
        <div className="p-6 text-grey-darker text-justify flex flex-col">
          {/* <img
            src="https://picsum.photos/300/300"
            alt="Some image"
            className="w-64 flex self-center rounded-full shadow-lg mb-6"
          />
          <p className="font-bold text-sm uppercase mb-2 text-blue-darker">
            Item description:
          </p>
          <span className="text-grey-darker">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </span> */}
          <div className="pt-4">
            <span className="uppercase bg-blue-500 text-white font-bold p-2 text-xs shadow rounded">
              25% off
            </span>
            <span className="uppercase bg-yellow-600 text-gray-100 font-bold ml-2 p-2 text-xs shadow rounded">
              stock: 3
            </span>
          </div>
        </div>
        <div className="p-6 text-grey-darker text-justify flex flex-row justify-end border-t">
          {/* <button className="uppercase self-end text-blue-600 mx-8 text-sm hover:text-blue-800">
            details
          </button> */}
          <button className="uppercase self-end bg-green-700 font-bold text-white px-6 py-4 rounded hover:bg-green-dark duration-4">
            <i className="fa fa-cart-plus mr-4"></i>Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
