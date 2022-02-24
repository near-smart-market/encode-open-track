import { FC, useState, useEffect } from "react";

export type Slide = {
  img: string;
  title: String;
  body?: String;
}

export type Slides = {
    slides: Array<Slide>
}

const ImageSlider: React.FC<Slides> = ({
    slides
}) => {
  const [lslides, setLSlides] = useState<Array<Slide>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setLSlides(slides);
  }, [])

  // handleSwipe: function() {
  //     // Stop
  //     if( this.touchstartX - this.touchendX > -20 && this.touchstartX - this.touchendX < 20 ) return;
  //     // Set previous index
  //     this.previousIndex = this.currentIndex;
  //     // Swipe
  //     if (this.touchendX < this.touchstartX) {
  //         // Swipe left
  //         this.currentIndex = Math.min(this.slides.length-1,this.currentIndex+1);
  //         this.previousTransition.start = 'translate-x-none opacity-1';
  //         this.previousTransition.end = '-translate-x-1/4 opacity-0';
  //         this.currentTransition.start = 'translate-x-1/4 opacity-0';
  //         this.currentTransition.end = 'translate-x-none opacity-1';
  //     } else {
  //         // Swipe right
  //         this.currentIndex = Math.max(0,this.currentIndex-1);
  //         this.previousTransition.start = 'translate-x-none opacity-1';
  //         this.previousTransition.end = 'translate-x-1/4 opacity-0';
  //         this.currentTransition.start = '-translate-x-1/4 opacity-0';
  //         this.currentTransition.end = 'translate-x-none opacity-1';
  //     }
  //     // Check previous index
  //     if( this.previousIndex !== this.currentIndex ) {
  //         this.showSlide();
  //     }
  // },

  const handleBottomClick = (index: number) => {
    setActive(index);
  }

  return (
    <div className="flex items-center justify-center px-5 py-5">
      <div
        className="w-full mx-auto rounded-3xl shadow-lg bg-white px-10 pt-16 pb-10 text-gray-600"
        style={{ maxWidth: 350 }}
      >
        <div className="overflow-hidden relative mb-1">
          {lslides.length > 0 && <div className="overflow-hidden relative">
            <div className="w-full overflow-hidden text-center select-none transition-all">
              <div className="w-64 h-64 border rounded-full mx-auto mb-10 overflow-hidden bg-cover bg-center">
                <img src={lslides[active].img} />
              </div>
              <h2 className="font-bold text-xl text-indigo-500 mb-3">
                {lslides[active].title}
              </h2>
              <p className="text-sm leading-tight h-16">
                {lslides[active].body}
              </p>
            </div>
          </div>}
        </div>
        <div className="flex justify-center">
          {lslides.map((_, index) => {
            return (
              <span
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
  );
};

export default ImageSlider;
