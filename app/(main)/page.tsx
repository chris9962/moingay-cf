import HeroSlider from "@/components/hero-slider"
import StorySection from "@/components/story-section"
import CoffeeGallery from "@/components/coffee-gallery"
import ProductsSection from "@/components/products-section"
import ScrollReveal from "@/components/scroll-reveal"

export default function Home() {
  return (
    <>
      <HeroSlider />
      <ScrollReveal>
        <StorySection />
      </ScrollReveal>
      <ScrollReveal>
        <CoffeeGallery />
      </ScrollReveal>
      <ScrollReveal>
        <ProductsSection />
      </ScrollReveal>
    </>
  )
}
