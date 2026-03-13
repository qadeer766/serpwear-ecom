"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
const testimonials = [
  {
    name: "Sophia Martinez",
    review:
      "This service exceeded my expectations. The team delivered everything on time. I highly recommend trying it out.",
    rating: 5,
  },
  {
    name: "Liam Johnson",
    review:
      "A smooth and enjoyable experience overall. Customer support was quick to respond. Would definitely return in the future.",
    rating: 4,
  },
  {
    name: "Ava Thompson",
    review:
      "The product quality was impressive. Everything worked perfectly right away. Truly worth every penny.",
    rating: 5,
  },
  {
    name: "Noah Williams",
    review:
      "I found the service extremely easy to use. The instructions were clear and helpful. I’m very satisfied with the outcome.",
    rating: 4,
  },
  {
    name: "Isabella Davis",
    review:
      "Fantastic experience from start to finish. The staff was friendly and professional. I would gladly recommend this to others.",
    rating: 5,
  },
  {
    name: "James Anderson",
    review:
      "Great attention to detail throughout the process. Communication was consistent and reliable. Overall, a very positive experience.",
    rating: 5,
  },
  {
    name: "Mia Rodriguez",
    review:
      "I had a small issue initially. Support resolved it quickly and efficiently. I appreciate the excellent customer care.",
    rating: 4,
  },
  {
    name: "Ethan Brown",
    review:
      "The results exceeded what I expected. Everything was delivered ahead of schedule. I will definitely use this again.",
    rating: 5,
  },
  {
    name: "Charlotte Wilson",
    review:
      "A highly professional service. Their team communicated clearly at every step. Absolutely worth the investment.",
    rating: 5,
  },
  {
    name: "Benjamin Taylor",
    review:
      "Good overall performance. The pricing felt fair for what was offered.\nI’m pleased with the final outcome.",
    rating: 4,
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">
        Customer Review
      </h2>
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="p-5">
            <div className="border rounded-lg p-5">
              <BsChatQuote size={30} className="mb-3" />
              <p className="mb-5">{item.review}</p>
              <h4 className="font-semibold">{item.name}</h4>
              <div className="flex mt-1">
               {Array.from({ length: item.rating }).map((_, i) => (
  <IoStar
    key={`star-${i}`}
    className="text-yellow-400"
    size={20}
  />
))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;
