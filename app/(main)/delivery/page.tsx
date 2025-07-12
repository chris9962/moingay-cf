import PageTitle from "@/components/page-title";
import {
  Clock,
  Phone,
  MapPin,
  Gift,
  Calendar,
  ArrowUp,
  Facebook,
} from "lucide-react";
import Link from "next/link";

export default function Delivery() {
  return (
    <div className="flex-1">
      <PageTitle
        title="Giao hàng tận nhà"
        subtitle="Bạn mến, nếu bạn lười đi xa, thì giờ tụi mình đã sẵn sàng để ship đến tận nhà những hương vị thân quen từ mỗingày đến bạn."
      />
      <div className="container mx-auto px-4 py-12">
        {/* Delivery Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-primary" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">
              Khung giờ giao hàng
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Tụi mình sẽ bắt đầu gửi đơn ship đi từ{" "}
            <span className="font-semibold text-primary">14.07.2025</span> trong
            ba khung giờ cố định:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                09:00 - 10:30
              </div>
              <div className="text-sm text-orange-700">Khung giờ sáng</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                15:00 - 16:30
              </div>
              <div className="text-sm text-blue-700">Khung giờ chiều</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                17:30 - 18:30
              </div>
              <div className="text-sm text-purple-700">Khung giờ tối</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="text-primary" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">
              Liên hệ đặt hàng
            </h3>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">
              Trong trường hợp bạn muốn nhận món nước sớm hơn thời gian giao
              hàng, bạn vui lòng gọi thông báo trước cho tụi mình qua Hotline
              hoặc inbox trực tiếp qua Fanpage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-primary text-white rounded-full p-3">
                <Phone size={20} />
              </div>
              <div>
                <Link
                  href="tel:0763558010"
                  className="font-semibold text-gray-800"
                >
                  0763558010
                </Link>
                <div className="text-sm text-gray-600">Gặp Hà</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-primary text-white rounded-full p-3">
                <Phone size={20} />
              </div>
              <div>
                <Link
                  href="tel:0394049489"
                  className="font-semibold text-gray-800"
                >
                  0394049489
                </Link>
                <div className="text-sm text-gray-600">Gặp Thảo</div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <Facebook className="h-6 w-6" /> <strong>Facebook:</strong>
              <a
                href="https://www.facebook.com/Moingayatelier?mibextid=LQQJ4d.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline"
              >
                mỗingày Fanpage
              </a>
            </p>
          </div>
        </div>

        {/* Promotion Programs */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="text-primary" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">
              Chương trình khuyến mãi
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
              <div className="text-pink-600 font-semibold mb-2 uppercase">
                Voucher 10%
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Với hoá đơn từ <span className="font-bold">88.000đ</span> khi
                dùng món tại chỗ
              </p>
              <div className="text-xs text-pink-600 font-medium">
                📅 Từ 14.7 - 31.7
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="text-green-600 font-semibold mb-2 uppercase">
                Đồng giá đặc biệt
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Menu đồng giá vào ngày <span className="font-bold">11</span>{" "}
                hàng tháng
              </p>
              <div className="text-xs text-green-600 font-medium">
                📅 Mỗi tháng
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="text-blue-600 font-semibold mb-2 flex items-center gap-2 uppercase">
                <ArrowUp size={16} />
                Free Up-size
              </div>
              <p className="text-sm text-gray-700 mb-2">Size Đủ ➜ Size Đã</p>
              <div className="text-xs text-blue-600 font-medium">
                📅 Thứ Năm hàng tuần
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Fees */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-primary" size={28} />
            <h3 className="text-2xl font-bold text-gray-800">Bảng giá ship</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-700 uppercase">
                    Freeship
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Miễn phí ship cho{" "}
                  <span className="font-bold">5 đơn hàng đầu tiên</span>
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-700 uppercase">
                    Trong bán kính 3km
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Phí ship: <span className="font-bold">17.000đ</span>
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-semibold text-orange-700 uppercase">
                    Trên 3km
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Phí ship: <span className="font-bold">20.000đ</span>
                  <br />
                  <span className="text-xs text-orange-600">
                    + 5.000đ/km phát sinh
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl">
                <div className="text-3xl mb-4">🚚</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Giao hàng nhanh chóng
                </h4>
                <p className="text-sm text-gray-600">
                  Cam kết giao đúng giờ trong khung giờ đã chọn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link href="tel:0394049489">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow">
              <Phone size={20} />
              Gọi ngay để đặt hàng
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
