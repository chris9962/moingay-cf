"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image: "/wooden-haven-cafe.png",
    title: "mõingày. original",
    location: "mõingày • 14 Phạm Hồng Thái, Huế",
  },
  {
    id: 2,
    image: "/cozy-cafe-buzz.png",
    title: "mõingày. experience",
    location: "mõingày • 25 Nguyễn Thị Minh Khai, Huế",
  },
  {
    id: 3,
    image: "/cozy-cafe-corner.png",
    title: "mõingày. atmosphere",
    location: "mõingày • 86 Đinh Tiên Hoàng, Huế",
  },
];

const HeroSlider = () => {
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Use aspect ratio for desktop and tablet, fixed height for mobile */}
      <div className="hidden sm:block w-full aspect-[1.66/1] max-h-[600px]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
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
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-10 right-10 text-white text-right z-10">
                <h2 className="text-3xl font-bold">{slide.title}</h2>
                <p className="text-lg">{slide.location}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile version with fixed height */}
      <div className="sm:hidden w-full h-[50vh]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
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
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-10 right-10 text-white text-right z-10">
                <h2 className="text-3xl font-bold">{slide.title}</h2>
                <p className="text-lg">{slide.location}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

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
  );
};

export default HeroSlider;
