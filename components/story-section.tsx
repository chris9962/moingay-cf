import Link from "next/link"
import Image from "next/image"
import ScrollReveal from "@/components/scroll-reveal"

const StorySection = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <ScrollReveal>
          <div>
            <h3 className="text-primary text-lg uppercase tracking-wide">THE STORY</h3>
            <h2 className="text-3xl font-bold mt-2 mb-4">mõingày CAFE</h2>
            <p className="text-gray-700 mb-6">
              mõingày là một thương hiệu cà phê tại Huế, Việt Nam được sáng lập vào năm 2017. Khởi đầu là một quán cà
              phê mang không khí hoài cổ, mõingày original nằm nép mình ở 14 Phạm Hồng Thái. Đây là mõingày nguyên bản
              đầu tiên, là khởi đầu kể nên câu chuyện chung trên phông nền riêng biệt, trở thành tiền đề để mở ra tinh
              thần của thương hiệu sau này.
            </p>
            <Link href="/about-us" className="inline-block text-primary hover:underline transition-all">
              Đọc tiếp...
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative h-60 rounded-lg overflow-hidden">
              <Image src="/plant-filled-cafe.png" alt="mõingày cafe exterior" fill className="object-cover" />
            </div>
            <div className="relative h-60 rounded-lg overflow-hidden">
              <Image src="/cozy-coffee-entry.png" alt="mõingày cafe entrance" fill className="object-cover" />
            </div>
            <div className="relative h-60 rounded-lg overflow-hidden">
              <Image src="/cozy-plant-cafe.png" alt="mõingày cafe interior" fill className="object-cover" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default StorySection
