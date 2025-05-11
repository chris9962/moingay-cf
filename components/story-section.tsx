import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/scroll-reveal";

const StorySection = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <ScrollReveal>
          <div>
            {/* <h3 className="text-primary text-lg uppercase tracking-wide">
              THE STORY
            </h3> */}
            <h2 className="text-3xl font-bold mt-2 mb-4">mỗingày</h2>
            <p className="text-gray-700 mb-6">
              mỗingày là thương hiệu tại Cần Thơ, Việt Nam. Khởi đầu với mô hình
              tiệm hoa nhỏ theo style xinh xắn, được sáng lập vào cuối 2021. với
              tâm niệm mang đến niềm vui và gắn kết giá trị cảm xúc đến mọi
              người thông qua chất liệu từ sự kết nối với đời sống thường nhật
              và trải nghiệm tinh thần. Đó là kim chỉ nam xuyên suốt cho câu
              chuyện thương hiệu từ mỗingày.
            </p>
            <Link
              href="/about-us"
              className="inline-block text-primary hover:underline transition-all"
            >
              Đọc tiếp...
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative h-60 rounded-lg overflow-hidden">
              <Image
                src="/aboutus/1.jpg"
                alt="mõingày cafe exterior"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-60 rounded-lg overflow-hidden">
              <Image
                src="/aboutus/2.jpg"
                alt="mõingày cafe entrance"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-60 rounded-lg overflow-hidden">
              <Image
                src="/aboutus/31.jpg"
                alt="mõingày cafe interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default StorySection;
