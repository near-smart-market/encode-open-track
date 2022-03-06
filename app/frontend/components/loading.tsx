import NotchedCircle from "../icons/notchedCircle";

const Loading = () => {
  return (
    <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
      <span
        className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0 animate-bounce" 
        style={{
          top: "50%",
        }}
      >
        <NotchedCircle />
        <p className="text-xl text-black -mx-5 absolute">Loading..</p>
      </span>
    </div>
  );
};

export default Loading;
