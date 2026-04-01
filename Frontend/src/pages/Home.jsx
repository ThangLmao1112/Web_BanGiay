import React, { useState } from "react";
import { CarouselCustom } from "../components/CarouselCustom";
import Header from "../components/Header";
import MostRatedProducts from "../components/MostRatedProducts";
import Testimonials from "../components/Testimonials";
import BlogSection from "../components/BlogSection";
import { Button, Input } from "@material-tailwind/react";
import Footer from "../components/Footer";

const Home = () => {
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <div>
      <div className="">
        <Header onSearchClick={toggleSearch} searchVisible={searchVisible} />
      </div>
      <CarouselCustom />
      <div className="">
        <h1 className="text-center text-3xl mt-5 mb-3">Xu hướng nổi bật</h1>
        {/* Video Elements in a Scrollable Row */}
        <div className="overflow-x-scroll hide-scroll-bar p-4 px-5 sm:px-10 md:px-20">
          <div className="flex space-x-4">
            {/* Video 1 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/3512344/3512344-hd_1080_1920_30fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 2 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/7316094/7316094-uhd_1440_2560_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 3 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/7872917/7872917-uhd_1440_2732_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 4 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/3048876/3048876-uhd_2560_1440_24fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 5 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/4228658/4228658-hd_1920_1080_24fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 6 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/5310858/5310858-uhd_2560_1440_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 7 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/4721750/4721750-uhd_2732_1440_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            {/* Video 8 */}
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/4858900/4858900-uhd_2732_1440_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
            <div className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[17rem] flex-shrink-0">
              <video
                src="https://videos.pexels.com/video-files/7876919/7876919-uhd_1440_2732_25fps.mp4"
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <h1 className="text-center text-3xl mt-5 mb-3">Bán chạy nhất</h1>
        <div className="">
          <MostRatedProducts />
        </div>

        <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden mb-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            }}
          >
            <div className="w-full h-full bg-black opacity-40"></div>
          </div>

          {/* Text Content */}
          <h1 className="relative text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-white drop-shadow-lg">
            Thời trang hiện đại, cập nhật mỗi tuần. Chất lượng cao cấp, giao
            hàng đúng hẹn
          </h1>
        </div>

        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Image Container */}
          <div className="flex-shrink-0 w-full lg:w-1/3">
            <img
              src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Descriptive image"
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>
          {/* Text Content */}
          <div className="flex-1 w-full lg:w-2/3">
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-light text-gray-700 leading-relaxed">
              <span className="font-semibold">
                Khám phá vẻ thanh lịch vượt thời gian và sự thoải mái hiện đại.
              </span>{" "}
              Khám phá bộ sưu tập thời trang cao cấp được tuyển chọn kỹ lưỡng,
              mang đến phong cách nổi bật và chất lượng khác biệt. Mỗi sản phẩm
              đều được chăm chút tỉ mỉ trong từng chi tiết và phục vụ nhanh
              chóng, giúp bạn tận hưởng sự tinh tế lẫn tiện lợi trong mọi lần mua
              sắm.
            </p>
          </div>
        </div>

        <div className="">
          <Testimonials />
        </div>
        <div className="">
          <BlogSection />
        </div>
        <section className="py-20 mx-auto container px-8 bg-gray-900 rounded-2xl mb-20">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 !items-center">
            <p className="text-white !font-semibold">
              Luôn cập nhật: Đăng ký để nhận tin độc quyền
              <span className="lg:inline-block font-thin">
                Nhận quyền truy cập sớm vào ưu đãi độc quyền, sản phẩm mới ra
                mắt và các mẹo hữu ích. Đăng ký ngay để luôn dẫn đầu với những
                cập nhật dành riêng cho bạn!
              </span>
            </p>
            <div
              className="flex items-start flex-col gap-4 md:flex-row"
            >
              <Input
                color="white"
                label="Nhập email của bạn"
                className="text-white border-white"
              />
              <Button className="flex-shrink-0 md:w-fit w-full bg-white text-black">
                Đăng ký
              </Button>
            </div>
          </div>
        </section>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
