"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import slider1 from "@/public/assets/images/slider-1.png";
import slider2 from "@/public/assets/images/slider-2.png";
import slider3 from "@/public/assets/images/slider-3.png";
import slider4 from "@/public/assets/images/slider-4.png";
import Image from "next/image";
import { LuChevronRight, LuChevronLeft } from "react-icons/lu";

/* Next Arrow */
const ArrowNext = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-12 h-12 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white shadow right-6 hover:bg-primary hover:text-white transition"
    >
      <LuChevronRight size={24} />
    </button>
  );
};

/* Previous Arrow */
const ArrowPrevious = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-12 h-12 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white shadow left-6 hover:bg-primary hover:text-white transition"
    >
      <LuChevronLeft size={24} />
    </button>
  );
};

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    arrows: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrevious />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="w-full overflow-hidden">
      <Slider {...settings}>
        {[slider1, slider2, slider3, slider4].map((slide, index) => (
          <div key={index}>
            <Image
              src={slide}
              alt={`slider-${index}`}
              className="w-full h-auto"
              priority
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MainSlider;