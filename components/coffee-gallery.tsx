"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const galleryImages = [
  {
    id: 1,
    image: "/gallery/1.jpg",
    alt: "Coffee shop interior",
  },
  {
    id: 2,
    image: "/gallery/2.jpg",
    alt: "Outdoor seating",
  },
  {
    id: 3,
    image: "/gallery/3.jpg",
    alt: "Coffee shop ambiance",
  },
  {
    id: 4,
    image: "/gallery/4.jpg",
    alt: "Customers enjoying coffee",
  },
  {
    id: 5,
    image: "/gallery/5.jpg",
    alt: "Coffee shop sign",
  },
  {
    id: 6,
    image: "/gallery/7.jpg",
    alt: "Coffee shop sign",
  },
];

const CoffeeGallery = () => {
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">
          Gặp gỡ bạn - mình
        </h2>
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            loop={true}
            autoplay={{
              delay: 4000,
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
          >
            {galleryImages.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={navigationPrevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label="Next slide"
            onClick={(e) => {
              e.preventDefault();
              swiperRef.current?.slideNext();
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <p className="mt-8">
          Tại <span className="font-bold text-black">mỗingày</span> dần dà đã có
          những dáng hình thân quen thường xuyên lui tới, chúng tôi thật lấy làm
          biết ơn và vui mừng vì khi cần một nơi để ngồi lại, bạn đã chọn ghé
          vào con hẻm nhỏ và chọn cho mình một góc trong không gian của quán
          cafe ngay góc ngã tư,đi qua vài sự thay đổi, đến nay cũng đã gom góp
          được kha khá những khoảnh khắc mà bạn ghé thăm nhà. chúng tôi xin phép
          được kể về đôi lần mà bạn chọn{" "}
          <span className="font-bold text-black">mỗingày</span> là chốn để dừng
          chân. Vui đón bạn, những ngày này và cả những ngày sau nữa..
        </p>
      </div>
    </section>
  );
};

export default CoffeeGallery;
