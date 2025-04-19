import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Contact & Policies */}
          <div className="space-y-4">
            <p>Thời gian hoạt động: 07:30-21:30</p>
            <p>Hotline 763558010</p>
            <p>Địa chỉ: 75/40/4 đường Trần Phú, cái khế, ninh kiều, cần thơ</p>

            <div className="pt-4 space-y-2">
              <Link href="#" className="block hover:text-primary transition-colors">
                Hướng dẫn mua hàng
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Chính sách thanh toán
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Chính sách vận chuyển
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Chính sách đổi trả – bảo hành
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Chính sách bảo mật thông tin
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Hình thức thanh toán
              </Link>
            </div>
          </div>

          {/* Middle Column - Store Menu */}
          <div>
            <h3 className="text-xl font-bold mb-4">CỬA HÀNG</h3>
            <p className="mb-4">Our Menu</p>
            <div className="space-y-2">
              <Link href="#" className="block hover:text-primary transition-colors">
                Cà phê
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Matcha
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Trà
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Sôcôla
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Add on
              </Link>
            </div>
          </div>

          {/* Right Column - Workshop & Products */}
          <div>
            <h3 className="text-xl font-bold mb-4">WORKSHOP</h3>
            <div className="space-y-2 mb-6">
              <Link href="#" className="block hover:text-primary transition-colors">
                Hoa
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Ngồi lại
              </Link>
            </div>

            <h3 className="text-xl font-bold mb-4">SẢN PHẨM</h3>
            <div className="space-y-2">
              <Link href="#" className="block hover:text-primary transition-colors">
                Hoa gói
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Hoa giỏ
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Hoa cưới
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Hoa cưới
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Cây xanh theo mùa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
