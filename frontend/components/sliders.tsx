"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";

const sliderStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    opacity: 0.5;
    width: 30px;
    height: 30px;
  }
  .swiper-button-next:after,
  .swiper-button-prev:after {
    color: white;
    opacity: 0.3;

  }
`;

interface SliderProps {
  sliderList: any[];
}

const Slider = ({ sliderList }: SliderProps) => {
  return (
    <>
      <style>{sliderStyles}</style>
      <div className="w-full my-6  py-6 bg-white">
        <div className="mx-4 w-full lg:max-w-7xl  flex flex-col items-center  overflow-x-clip lg:mx-auto">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="w-full"
          >
            {sliderList.map((slider, index) => {
              const imageUrl = slider.image?.[0]?.url;
              console.log("Slider image URL:", imageUrl);

              return (
                <SwiperSlide
                  key={slider.documentId || index}
                  className="w-full h-72 md:h-96 lg:h-[800px] my-4 lg:my-10 flex items-center justify-center mx-auto overflow-hidden"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={slider.name || "slider image"}
                      width={1000}
                      height={600}
                      className="w-full object-cover  h-[200px] md:h-[400px] lg:h-[500px] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      No image available
                    </div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Slider;
