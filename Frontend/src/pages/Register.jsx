import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    phone: "",
    password: "",
    address: [{ addressLine1: "", city: "", province: "", postalCode: "" }],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, e) => {
    const newAddresses = [...formData.address];
    newAddresses[index][e.target.name] = e.target.value;
    setFormData({ ...formData, address: newAddresses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/users/register", formData);
      SuccessToast("Đăng ký thành công");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gender: "Male",
        phone: "",
        password: "",
        address: [{ addressLine1: "", city: "", province: "", postalCode: "" }],
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      ErrorToast("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto my-10 p-8 bg-white shadow-xl rounded-lg transform transition duration-500 hover:shadow-2xl">
      <ToastContainer />
      {loading && <LoadingOverlay />}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Đăng ký tài khoản
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <fieldset className="p-4 border rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Thông tin cá nhân
            </legend>
            <div className="mt-4">
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                label="Tên"
                size="lg"
                color="blue"
                placeholder="Nhập tên của bạn"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                label="Họ"
                size="lg"
                color="blue"
                placeholder="Nhập họ của bạn"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                label="Email"
                size="lg"
                color="blue"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            <div className="mt-4">
              <Select
                label="Chọn giới tính"
                id="gender"
                name="gender"
                size="lg"
                color="blue"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e })}
                required
              >
                <Option value="Male">Nam</Option>
                <Option value="Female">Nữ</Option>
                <Option value="Other">Khác</Option>
              </Select>
            </div>
            <div className="mt-4">
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                label="Số điện thoại"
                size="lg"
                color="blue"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                label="Mật khẩu"
                size="lg"
                color="blue"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </fieldset>
          <fieldset className="p-4 border rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Thông tin địa chỉ
            </legend>
            <div className="mt-4">
              <Textarea
                name="addressLine1"
                rows="4"
                value={formData.address[0].addressLine1}
                label="Địa chỉ"
                color="blue"
                onChange={(e) => handleAddressChange(0, e)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                name="city"
                value={formData.address[0].city}
                onChange={(e) => handleAddressChange(0, e)}
                variant="outlined"
                label="Thành phố"
                size="lg"
                color="blue"
                placeholder="Nhập thành phố"
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                name="province"
                value={formData.address[0].province}
                onChange={(e) => handleAddressChange(0, e)}
                variant="outlined"
                label="Tỉnh/Thành"
                size="lg"
                color="blue"
                placeholder="Nhập tỉnh/thành"
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                name="postalCode"
                value={formData.address[0].postalCode}
                onChange={(e) => handleAddressChange(0, e)}
                variant="outlined"
                label="Mã bưu chính"
                size="lg"
                color="blue"
                placeholder="Nhập mã bưu chính"
              />
            </div>
          </fieldset>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default Register;
