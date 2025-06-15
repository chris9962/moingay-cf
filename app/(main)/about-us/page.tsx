import PageTitle from "@/components/page-title";
import AboutSlider from "@/components/about-slider";
import ScrollReveal from "@/components/scroll-reveal";

export default function AboutUs() {
  return (
    <div>
      <PageTitle title="Về chúng mình" />

      <AboutSlider />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4"> Câu chuyện</h2>
              <p className="text-gray-700">
                <strong>mỗingày</strong> là thương hiệu tại Cần Thơ, Việt Nam.
                Với tâm niệm mang đến niềm vui và gắn kết cảm xúc thông qua chất
                liệu từ sự kết nối với trải nghiệm đời sống thường nhật. mỗingày
                khởi đầu là mô hình tiệm hoa, kế đến là không gian café kết hợp
                tiệm hoa, từ năm 2021. Dù là ở dáng hình nào, kim chỉ nam xuyên
                suốt cho câu chuyện thương hiệu từ mỗingày đã, đang và sẽ luôn
                mang đến những điều dễ chịu, gần gũi và thuần lành.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Tinh thần </h2>
              <p className="text-gray-700">
                “mỗi ngày cùng chọn một niềm vui “ – câu hát của cố nhạc sĩ
                Trịnh Công Sơn đã định hình nên phong cách của chúng tôi.
                <br />
                Với mong muốn khi ở tại mỗingày, bạn sẽ luôn có thể gọi tên được
                niềm vui cho riêng mình. Tại mỗingày, chúng tôi có những cột mốc
                đánh dấu sự chuyển mình rõ rệt, Khởi đầu là mỗingày.homespace,
                tiệm hoa là nơi mở ra câu chuyện với tinh thần chung. Tại
                homespace, chúng tôi đặt dấu ấn thông qua việc gửi đến khách
                hàng những câu chuyện, những khoảnh khắc trong đời sống thường
                nhật thông qua trải nghiệm về Hoa cỏ. homespace là nơi giao lưu,
                mở rộng và kết nối rất nhiều con người và cuộc gặp để tạo tiền
                đề cho không gian tại mỗingày.atelier sau này.
                <br />
                <br />
                mỗingày.atelier là nơi tiếp nối hành trình, là bước ngoặt mới và
                là cột mốc trong câu chuyện tinh thần từ mỗingày. Atelier được
                biết đến là mô hình quán cafe kết hợp tiệm hoa và là nơi tổ chức
                workshop định kỳ. Tại đây, chúng tôi chú trọng đến giá trị cảm
                xúc và chất lượng trong từng sản phẩm, nơi mỗi thức uống đều gợi
                lên một trạng thái, giá trị, nếp sống mong muốn được ôm ấp và
                gìn giữ. Chúng tôi tâm niệm mang đến không gian để mỗi trải
                nghiệm đều quay về với sự kết nối tự thân và sự kết nối với
                những điều đẹp đẽ xung quanh.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Giá trị </h2>
              <p className="text-gray-700">
                mỗingày ấp ủ là một chốn dừng chân, là một nơi thân gần để khi
                cần nơi để quay về hay một điểm tựa giữa những mông lung bên
                ngoài, bạn hoàn toàn có thể tin tưởng và cảm thấy an toàn.
                mỗingày, vì vậy không giới hạn chỉ là một tiệm hoa hay một quán
                café,.. mà dù trong bất kỳ dáng hình nào, chúng tôi đều ươm
                những hạt giống thuần lành và chân thành trong từng bước đi.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h2 className="text-2xl font-bold mb-4">Tiếp bước</h2>
              <p className="text-gray-700">
                mỗingày vẫn đang ấp ủ và ươm mầm những hạt giống mới, viết thêm
                những câu chuyện mới, để tiếp nối dòng chảy từ 2021 đến nay, và
                cả những năm sau nữa.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
