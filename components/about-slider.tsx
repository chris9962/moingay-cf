"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const aboutImages = [
  {
    id: 1,
    image: "/about-us-cafe.png",
    alt: "mõingày cafe exterior",
  },
  {
    id: 2,
    image: "/plant-filled-cafe.png",
    alt: "mõingày cafe interior with plants",
  },
  {
    id: 3,
    image: "/cozy-coffee-entry.png",
    alt: "mõingày cafe entrance",
  },
  {
    id: 4,
    image: "/cafe-conversations.png",
    alt: "Customers enjoying coffee",
  },
];

const AboutSlider = () => {
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            pagination={{ clickable: true }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSwiper={(swiper) => {
              // Update swiper instance when it's initialized
              setTimeout(() => {
                if (
                  navigationPrevRef.current &&
                  navigationNextRef.current &&
                  swiper.params?.navigation
                ) {
                  const navOptions = swiper.params?.navigation as {
                    prevEl: HTMLElement | null;
                    nextEl: HTMLElement | null;
                  };
                  navOptions.prevEl = navigationPrevRef.current;
                  navOptions.nextEl = navigationNextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              });
            }}
            className="w-full"
          >
            {aboutImages.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative w-full h-[400px]">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={navigationPrevRef}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"
            aria-label="Previous slide"
            onClick={(e) => {
              e.preventDefault();
              swiperRef.current?.slidePrev();
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            ref={navigationNextRef}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"
            aria-label="Next slide"
            onClick={(e) => {
              e.preventDefault();
              swiperRef.current?.slideNext();
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSlider;
