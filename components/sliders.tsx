import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface SliderProps {
  sliderList: any[];
}

const Slider = ({ sliderList }: SliderProps) => {
  console.log("Slider List:", sliderList);
  
  return (
    <div className="w-full px-4 py-6">
      <div className="mx-4 w-full max-w-4xl md:max-w-5xl lg:max-w-7xl flex flex-col items-center px-12 ">
        <Carousel>
        <CarouselContent>
          {sliderList.map((slider, index) => {
            // image from the array
            const imageUrl = slider.image?.[0]?.url;
            console.log("Slider image URL:", imageUrl);
            
            return (
              <CarouselItem
                key={slider.documentId || index}
                className="w-full h-64 md:h-96 lg:h-[500px] flex items-center justify-center"
              >
                {imageUrl ? (
                  <Image
                    src={process.env.NEXT_PUBLIC_BASE_URL + imageUrl}
                    alt={slider.name || "slider image"}
                    width={1000}
                    height={600}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    No image available
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
    </div>
  );
};

export default Slider;