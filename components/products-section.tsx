"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { ZodNullDef } from "zod";

const ProductsSection = () => {
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await fetch("/api/products/random");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch products");
        }

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch products");
        }
        console.log(result.data);
        if (result.data.length === 0) {
          console.log("No products found");
          setProducts([]);
        } else {
          setProducts(result.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);
  if (error || loading) {
    return null;
  }

  return (
    <section className="py-16 bg-[#363737] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4 dark-text">
          PRODUCTS
        </h2>

        <div className="flex justify-center mb-10">
          <Link
            href="/products"
            className="inline-flex items-center border border-white px-4 py-2 dark-text hover:bg-white hover:text-[#363737] transition-colors"
          >
            See more
          </Link>
        </div>

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
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                    alt={product.name}
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
      </div>
    </section>
  );
};

export default ProductsSection;
