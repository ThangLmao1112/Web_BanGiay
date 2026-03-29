import React, { useEffect } from "react";
import myImage from "../assets/myImage.jpeg";
import MapComponent from "../components/MapComponent";


const teamMembers = [
  {
    name: "Syed Hisham Shah",
    role: "Nhà sáng lập & CEO",
    image: myImage, 
    description:
      "Syed Hisham Shah là doanh nhân giàu kinh nghiệm trong lĩnh vực thương mại điện tử, tập trung mang đến các giải pháp giày dép chất lượng cao. Với hơn 10 năm kinh nghiệm, anh có nền tảng vững chắc về bán lẻ và tiếp thị số.",
  },
  {
    name: "Maaz Shinwari",
    role: "Trưởng bộ phận thiết kế",
    image: "https://via.placeholder.com/150",
    description:
      "Maaz Shinwari dẫn dắt đội ngũ thiết kế bằng sự sáng tạo và chỉn chu. Chuyên môn của cô đảm bảo sản phẩm không chỉ đẹp mà còn thoải mái và bền bỉ.",
  },
  {
    name: "Sherjan",
    role: "Chuyên gia marketing",
    image: "https://via.placeholder.com/150",
    description:
      "Sherjan là chuyên gia marketing với sự am hiểu sâu về xu hướng thương mại điện tử. Các chiến lược sáng tạo của anh giúp chúng tôi tiếp cận khách hàng rộng hơn và nâng cao trải nghiệm mua sắm.",
  },
];

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <section className="px-6 py-4 lg:py-8 text-gray-800">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Về The Shoe Shop
          </h2>
          <p className="max-w-2xl mx-auto text-sm lg:text-lg">
            Tại The Shoe Shop, chúng tôi cam kết mang đến các sản phẩm giày dép
            chất lượng cao cho cả nam và nữ. Từ sneaker hợp xu hướng đến giày
            cao gót cổ điển, bộ sưu tập của chúng tôi được chọn lọc để phù hợp
            với nhiều phong cách và nhu cầu khác nhau. Chúng tôi ưu tiên sự
            thoải mái, thời trang và độ bền để khách hàng luôn tự tin trong mỗi
            bước chân.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl lg:text-4xl font-semibold mb-8 text-center">
            Đội ngũ của chúng tôi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-black p-6 rounded-lg text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                />
                <h4 className="text-xl font-semibold">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="mt-4 text-gray-700 text-base">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 text-center">
          <h3 className="text-2xl lg:text-4xl font-semibold mb-8">
            Giá trị cốt lõi
          </h3>
          <p className="max-w-2xl mx-auto text-sm lg:text-lg">
            Với tư cách một tập thể, chúng tôi cam kết mang đến dịch vụ xuất
            sắc, đổi mới liên tục và phát triển bền vững trong ngành giày dép.
            Mục tiêu của chúng tôi là giúp mọi khách hàng tìm được lựa chọn phù
            hợp nhất và tự tin với quyết định của mình.
          </p>
        </div>

        <div className="mb-16 text-center">
          <h3 className="text-2xl lg:text-4xl font-semibold mb-8">
            Tìm chúng tôi
          </h3>
          <div className="h-96 bg-gray-300 rounded-lg flex items-center justify-center">
            <MapComponent /> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
