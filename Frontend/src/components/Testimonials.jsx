import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    message:
      "Dịch vụ rất tốt, sản phẩm chất lượng cao. Mình rất khuyên mọi người nên trải nghiệm!",
  },
  {
    id: 2,
    name: "Omar Ahmed",
    message:
      "Trải nghiệm mua sắm tuyệt vời, giao hàng đúng hẹn và hỗ trợ khách hàng rất chu đáo.",
  },
  {
    id: 3,
    name: "Fatima Ali",
    message:
      "Chất lượng sản phẩm rất tốt, mẫu mã luôn hợp xu hướng và dễ phối đồ.",
  },
  {
    id: 4,
    name: "Ahmed Raza",
    message:
      "Một cửa hàng đáng tin cậy với nhiều mặt hàng thời trang và dịch vụ vượt mong đợi.",
  },
  {
    id: 5,
    name: "Sara Khan",
    message:
      "Lần nào mua cũng hài lòng. Sản phẩm luôn vượt kỳ vọng của mình.",
  },
];

const CustomerTestimonials = () => {
  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-center">
        Khách hàng nói gì về chúng tôi
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-auto lg:h-[22rem]">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="border border-black p-6 lg:p-10 rounded-lg flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <p className="text-gray-800 mb-4 text-sm lg:text-base">
              {testimonial.message}
            </p>
            <span className="text-gray-600 font-semibold text-sm lg:text-base">
              {testimonial.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
