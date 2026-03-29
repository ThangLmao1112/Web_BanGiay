import React, { useEffect } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="flex justify-center items-center  px-4 py-8 lg:py-16">
      <div className="w-full max-w-4xl mx-auto text-center">
        <p className="mb-4 text-base lg:text-2xl text-blue-gray-600">
          Chăm sóc khách hàng
        </p>
        <h1 className="mb-4 text-3xl lg:text-5xl text-blue-gray-900">
          Chúng tôi luôn sẵn sàng hỗ trợ
        </h1>
        <p className="mb-10 lg:mb-20 max-w-3xl mx-auto text-lg text-gray-500">
          Dù bạn có câu hỏi về dịch vụ, cần hỗ trợ kỹ thuật, hay muốn góp ý để
          cải thiện, đội ngũ của chúng tôi luôn sẵn sàng lắng nghe.
        </p>

        <div className="flex justify-center">
          <form className="flex flex-col gap-4 w-full max-w-lg mx-auto">
            <p className="text-left font-semibold text-gray-600">
              Điền thông tin liên hệ
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input for First Name */}
              <Input
                type="text"
                id="firstName"
                name="firstName"
                variant="outlined"
                label="Tên"
                size="lg"
                placeholder="Nhập tên của bạn"
                required
              />
              {/* Input for Email */}
              <Input
                type="email"
                id="email"
                name="email"
                variant="outlined"
                label="Email"
                size="lg"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div>
              <p className="mb-2 text-left font-medium text-gray-900">
                Nội dung của bạn
              </p>
              <Textarea
                name="message"
                id="message"
                rows="3"
                className="w-full px-4 py-2"
                variant="outlined"
                label="Hãy chia sẻ câu hỏi hoặc góp ý với chúng tôi 🙂"
                size="lg"
                required
              />
            </div>

            <Button className="w-full" color="gray">
              Gửi tin nhắn
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
