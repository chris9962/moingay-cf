import PageTitle from "@/components/page-title"
import AboutSlider from "@/components/about-slider"
import ScrollReveal from "@/components/scroll-reveal"

export default function AboutUs() {
  return (
    <div>
      <PageTitle title="ABOUT US" />

      <AboutSlider />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700">
                mõingày là một thương hiệu cà phê tại Huế, Việt Nam được sáng lập vào năm 2017. Khởi đầu là một quán cà
                phê mang không khí hoài cổ, mõingày original nằm nép mình ở 14 Phạm Hồng Thái. Đây là mõingày nguyên bản
                đầu tiên, là khởi đầu kể nên câu chuyện chung trên phông nền riêng biệt, trở thành tiền đề để mở ra tinh
                thần của thương hiệu sau này.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Philosophy</h2>
              <p className="text-gray-700">
                Với không gian ấm cúng và thân thiện, mõingày mang đến cho khách hàng không chỉ là những tách cà phê
                thơm ngon mà còn là trải nghiệm thư giãn, gặp gỡ và kết nối. Chúng tôi tự hào về nguồn cà phê chất lượng
                cao được lựa chọn kỹ lưỡng từ các vùng trồng nổi tiếng của Việt Nam.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Growth</h2>
              <p className="text-gray-700">
                Qua nhiều năm phát triển, mõingày đã mở rộng với nhiều chi nhánh tại Huế và Đà Nẵng, mỗi địa điểm đều
                mang một nét đặc trưng riêng nhưng vẫn giữ nguyên tinh thần và chất lượng của thương hiệu. Chúng tôi
                không ngừng đổi mới và sáng tạo để mang đến những trải nghiệm tuyệt vời nhất cho khách hàng.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Invitation</h2>
              <p className="text-gray-700">
                Tại mõingày, chúng tôi tin rằng mỗi tách cà phê là một câu chuyện, một khoảnh khắc để thưởng thức và
                chia sẻ. Chúng tôi mời bạn đến và trải nghiệm không gian, hương vị và văn hóa cà phê độc đáo của chúng
                tôi.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
