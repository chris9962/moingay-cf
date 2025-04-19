// Mock product data
export const products = [
  {
    id: 1,
    name: "Cà phê muối",
    description: "Coffee with salt",
    price: 45000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BC9C13D75-7B25-4926-9FF0-A79E6376646E%7D-I5ALPpjX8oEsBX9o8IUpSR1NpGyOLb.png",
    category: "drinks",
    detailHtml: `
      <p>Bạn đã từng thử cà phê muối tại tan. chưa? Nay tan. mang đến hương vị mặn và ngọt đầy bất ngờ, kết hợp hoàn hảo với sự đậm đà của cà phê và foam muối thu gọn lại trong một chai cà phê để bạn mang theo tiện lợi.</p>
      <ul>
        <li>Thành phần: Cà phê House Blend, Kem Muối</li>
        <li>Hướng dẫn sử dụng:</li>
        <li>Lắc đều trước khi uống</li>
        <li>Ngon hơn khi uống lạnh hoặc dùng với đá</li>
      </ul>
      <p>– Hạn sử dụng:</p>
      <p>+ Bảo quản lạnh: 07 ngày kể từ ngày sản xuất với điều kiện nhiệt độ <8 độ C</p>
      <p>+ Bảo quản nhiệt độ thường (thường áp dụng với vận chuyển xa): 2 ngày. Sau 2 ngày nếu tiếp tục bảo quản lạnh có thể sử dụng thêm 3 ngày nữa. Đơn vận chuyển xa, sau khi nhận được vui lòng bảo quản lạnh.</p>
    `,
  },
  {
    id: 2,
    name: "Coffee Desserts",
    description: "Layered coffee desserts",
    price: 55000,
    image: "/layered-coffee-pastry-delights.png",
    category: "desserts",
    detailHtml: `
      <p>Thưởng thức hương vị ngọt ngào của tráng miệng cà phê nhiều lớp của chúng tôi.</p>
      <ul>
        <li>Thành phần: Cà phê, kem tươi, bánh quy</li>
        <li>Được phục vụ trong ly thủy tinh sang trọng</li>
        <li>Hoàn hảo để kết thúc bữa ăn</li>
      </ul>
      <p>Sản phẩm nên được tiêu thụ trong ngày để đảm bảo hương vị tốt nhất.</p>
    `,
  },
  {
    id: 3,
    name: "Iced Coffee",
    description: "Signature iced coffee",
    price: 35000,
    image: "/iced-coffee-pour.png",
    category: "drinks",
    detailHtml: `
      <p>Cà phê đá đặc trưng của mõingày, được pha từ hạt cà phê rang xay tại chỗ.</p>
      <ul>
        <li>Thành phần: Cà phê nguyên chất, đường</li>
        <li>Phục vụ với đá viên trong ly thủy tinh</li>
        <li>Hoàn hảo cho những ngày nóng bức</li>
      </ul>
      <p>Bạn có thể yêu cầu điều chỉnh độ ngọt theo sở thích.</p>
    `,
  },
  {
    id: 4,
    name: "Coffee Specialties",
    description: "Special coffee desserts",
    price: 65000,
    image: "/coffee-dessert-board.png",
    category: "desserts",
    detailHtml: `
      <p>Bộ sưu tập các món tráng miệng đặc biệt với hương vị cà phê.</p>
      <ul>
        <li>Thành phần: Cà phê, socola, kem tươi, bánh quy</li>
        <li>Được phục vụ trên khay gỗ sang trọng</li>
        <li>Lý tưởng để chia sẻ với bạn bè</li>
      </ul>
      <p>Có sẵn theo mùa, vui lòng hỏi nhân viên phục vụ về các lựa chọn hiện tại.</p>
    `,
  },
  {
    id: 5,
    name: "Espresso",
    description: "Classic espresso shot",
    price: 30000,
    image: "/single-espresso.png",
    category: "drinks",
    detailHtml: `
      <p>Một shot espresso đậm đà, được chiết xuất hoàn hảo từ hạt cà phê rang medium-dark.</p>
      <ul>
        <li>Thành phần: 100% cà phê Arabica</li>
        <li>Phục vụ trong tách espresso truyền thống</li>
        <li>Hương vị đậm đà với crema hoàn hảo</li>
      </ul>
      <p>Thưởng thức ngay khi phục vụ để có trải nghiệm tốt nhất.</p>
    `,
  },
  {
    id: 6,
    name: "Cappuccino",
    description: "Espresso with steamed milk",
    price: 45000,
    image: "/latte-art-cappuccino.png",
    category: "drinks",
    detailHtml: `
      <p>Cappuccino truyền thống với tỷ lệ hoàn hảo giữa espresso, sữa hơi và bọt sữa.</p>
      <ul>
        <li>Thành phần: Espresso, sữa tươi</li>
        <li>Được trang trí với nghệ thuật latte</li>
        <li>Hương vị cân bằng giữa đắng và ngọt</li>
      </ul>
      <p>Có thể yêu cầu thêm bột quế hoặc ca cao theo sở thích.</p>
    `,
  },
  {
    id: 7,
    name: "Croissant",
    description: "Buttery French pastry",
    price: 25000,
    image: "/golden-croissant.png",
    category: "pastries",
    detailHtml: `
      <p>Bánh sừng bò Pháp truyền thống, được làm từ bơ chất lượng cao.</p>
      <ul>
        <li>Thành phần: Bột mì, bơ Pháp, men</li>
        <li>Nướng tươi mỗi ngày</li>
        <li>Lớp vỏ giòn với ruột mềm xốp</li>
      </ul>
      <p>Hoàn hảo khi thưởng thức cùng cà phê buổi sáng.</p>
    `,
  },
  {
    id: 8,
    name: "Chocolate Cake",
    description: "Rich chocolate cake",
    price: 40000,
    image: "/decadent-chocolate-slice.png",
    category: "desserts",
    detailHtml: `
      <p>Bánh socola đậm đà với lớp kem socola mịn màng.</p>
      <ul>
        <li>Thành phần: Bột mì, socola đen, đường, trứng</li>
        <li>Phục vụ với một quả anh đào trang trí</li>
        <li>Hương vị ngọt ngào và đậm đà</li>
      </ul>
      <p>Có thể yêu cầu thêm kem tươi hoặc kem đánh.</p>
    `,
  },
]

// Function to get a product by ID
export const getProductById = (id: number) => {
  return products.find((product) => product.id === id) || null
}

// Mock function to simulate API call
export const fetchProductById = async (id: number) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return getProductById(id)
}
