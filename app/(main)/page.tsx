import HeroSlider from "@/components/hero-slider";
import StorySection from "@/components/story-section";
import CoffeeGallery from "@/components/coffee-gallery";
import ProductsSection from "@/components/products-section";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <StorySection />
      <CoffeeGallery />
      <ProductsSection />
    </>
  );
}
