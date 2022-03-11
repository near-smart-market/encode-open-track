import { FC, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export type Slide = {
  img: string;
  title: string;
  body?: String;
};

export type Props = {
  slides?: Array<Slide>;
  media_url: string;
};

const ImageSlider: React.FC<Props> = ({ slides, media_url }) => {
  const [lslides, setLSlides] = useState<Array<Slide>>([]);
  const [active, setActive] = useState<number>(0);
  const [popup, setPopup] = useState<boolean>(false);

  useEffect(() => {
    if (slides !== undefined) {
      setLSlides(slides);
    }
  }, []);

  const handleBottomClick = (index: number) => {
    setActive(index);
  };

  const handleFullImageClick = () => {
    setPopup(true);
  };

  const handleNextClick = () => {
    if (active + 1 > lslides.length - 1) {
      setActive(0);
      return;
    }
    setActive(active + 1);
  };

  const handlePreviousClick = () => {
    if (active - 1 < 0) {
      setActive(lslides.length - 1);
      return;
    }
    setActive(active - 1);
  };

  return (
    <>
      <div className="flex items-center justify-center px-5 py-5">
        <div
          className="w-full mx-auto rounded-3xl shadow-lg bg-white px-10 pt-16 pb-10 text-gray-600"
          style={{ maxWidth: 350 }}
        >
          {lslides.length >= 1 ? (
            <div className="overflow-hidden relative mb-1">
              {lslides.length > 0 && (
                <div className="overflow-hidden relative">
                  <div className="w-full overflow-hidden text-center select-none transition-all">
                    <div
                      className="w-64 h-64 border rounded-full mx-auto mb-10 overflow-hidden bg-cover bg-center hover:cursor-pointer"
                      onClick={handleFullImageClick}
                    >
                      <Image
                        src={lslides[active].img}
                        alt={lslides[active].title}
                        height={300}
                        width={300}
                      />
                    </div>
                    <h2 className="font-bold text-xl text-indigo-500 mb-3">
                      {lslides[active].title}
                    </h2>
                    <p className="text-sm leading-tight h-16">
                      {lslides[active].body}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-64 h-64 border rounded-full mx-auto mb-10 overflow-hidden bg-cover bg-center hover:cursor-pointer"
            >
              <Image
                src={media_url}
                alt="Product Image"
                height={300}
                width={300}
              />
            </div>
          )}
          <div className="flex justify-center">
            {lslides.map((slide, index) => {
              return (
                <span
                  key={slide.title}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    active === index ? "bg-indigo-500" : "bg-gray-200"
                  }`}
                  onClick={() => handleBottomClick(index)}
                />
              );
            })}
          </div>
        </div>
      </div>
      {popup && (
        <div className=" fixed w-full h-full top-0 left-0 bg-gray-800 z-40 overflow-x-hidden flex flex-col align-center justify-center items-center">
          <div className=" fixed w-full h-full top-0 left-0 overflow-x-hidden flex justify-between items-center p-10">
            <div
              className="text-white hover:bg-white hover:text-black p-2 rounded hover:cursor-pointer"
              onClick={handlePreviousClick}
            >
              Previous
            </div>
            <div
              className="text-white hover:bg-white hover:text-black p-2 rounded hover:cursor-pointer"
              onClick={handleNextClick}
            >
              Next
            </div>
          </div>
          <div
            onClick={() => setPopup(false)}
            className="absolute right-5 top-5 bg-red-900 text-white p-5 rounded-full hover:cursor-pointer hover:bg-red-700 "
          >
            X
          </div>
          <img
            src={lslides[active].img}
            alt={lslides[active].title}
            className="h-4/5"
          />
          <div>
            <h2 className="font-bold text-xl text-white mb-3 mt-2">
              {lslides[active].title}
            </h2>
            <p className="text-sm leading-tight text-gray-300 center h-16">
              {lslides[active].body}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// Tailwind CSS Code

export default ImageSlider;
