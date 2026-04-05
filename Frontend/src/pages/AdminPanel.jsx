import React, { useEffect, useState } from "react";
import { FaHome, FaUsers, FaShoppingBag, FaCog } from "react-icons/fa";
import { MdArchive } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddProductForm from "../components/AddProductForm";
import UserList from "../components/UserList";
import UserDeleteList from "../components/UserDeleteList";
import MostActiveUsers from "../components/MostActiveUsers";
import ManageProducts from "./ManageProducts";
import AllProducts from "../components/AllProducts";
import AdminOrderManagement from "../components/AdminOrderManagement";
import Profile from "./Profile";

const sidebarItems = [
  { label: "Bảng điều khiển", icon: FaHome, component: <div>Bảng điều khiển</div> },
  { label: "Quản lý người dùng", icon: FaUsers, component: null },
  { label: "Quản lý sản phẩm", icon: MdArchive, component: null },
  { label: "Quản lý đơn hàng", icon: FaShoppingBag, component: null },
  { label: "Cài đặt", icon: FaCog, component: null },
];

const productManagementItems = [
  { label: "Thêm sản phẩm", component: <AddProductForm /> },
  { label: "Quản lý sản phẩm", component: <ManageProducts /> },
  { label: "Tất cả sản phẩm", component: <AllProducts /> },
];

const userManagementItems = [
  {
    label: "Tất cả người dùng",
    component: (
      <div>
        <UserList />
      </div>
    ),
  },
  {
    label: "Người dùng hoạt động nhiều nhất",
    component: (
      <div>
        <MostActiveUsers />
      </div>
    ),
  },
  {
    label: "Xóa người dùng",
    component: (
      <div>
        <UserDeleteList />
      </div>
    ),
  },
];

const orderManagementItems = [
  { label: "Xem đơn hàng", component: <AdminOrderManagement mode="view" /> },
  {
    label: "Cập nhật trạng thái đơn",
    component: <AdminOrderManagement mode="update" />,
  },
  { label: "Hủy đơn hàng", component: <AdminOrderManagement mode="cancel" /> },
  { label: "Tất cả đơn hàng", component: <AdminOrderManagement mode="all" /> },
];

const settingsItems = [
  {
    label: "Hồ sơ & mật khẩu",
    component: <Profile />,
  },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(
    sidebarItems[0].component
  );
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const handleDropdownItemClick = (component) => {
    setActiveComponent(component);
    setIsProductDropdownOpen(false);
    setIsUserDropdownOpen(false);
    setIsOrderDropdownOpen(false);
    setIsSettingsDropdownOpen(false);
  };

  useEffect(() => {
    const verifyAdminAccess = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.data?.role !== "admin") {
          navigate("/");
          return;
        }
      } catch (error) {
        navigate("/login");
        return;
      } finally {
        setCheckingAccess(false);
      }
    };

    verifyAdminAccess();
  }, [navigate]);

  if (checkingAccess) {
    return <div className="p-6">Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0 lg:w-72 xl:w-80`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 px-6 py-4 bg-black text-white relative">
            <h1 className="text-xl font-bold">Bảng quản trị</h1>
            <button
              className="md:hidden absolute top-4 right-4 p-2 text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-hidden scroll-smooth bg-gray-800 ">
            <ul className="space-y-2">
              {sidebarItems.map(({ label, icon: Icon, component }, index) => (
                <li key={index} className="relative group">
                  {label === "Quản lý sản phẩm" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg ${
                          isProductDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsProductDropdownOpen(!isProductDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isProductDropdownOpen
                            ? "max-h-40 opacity-100 mb-3"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {productManagementItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : label === "Bảng điều khiển" ? (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg `}
                      onClick={() => setActiveComponent(component)}
                    >
                      <Icon className="h-6 w-6 mr-3" />
                      {label}
                    </button>
                  ) : label === "Quản lý người dùng" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg   ${
                          isUserDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsUserDropdownOpen(!isUserDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isUserDropdownOpen
                            ? "max-h-40 opacity-100 mb-3"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {userManagementItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : label === "Quản lý đơn hàng" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg   ${
                          isOrderDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsOrderDropdownOpen(!isOrderDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isOrderDropdownOpen
                            ? "max-h-40 opacity-100 mb-8"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {orderManagementItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : label === "Cài đặt" ? (
                    <>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base lg:text-lg   ${
                          isSettingsDropdownOpen ? "bg-gray-700" : ""
                        }`}
                        onClick={() =>
                          setIsSettingsDropdownOpen(!isSettingsDropdownOpen)
                        }
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        {label}
                      </button>
                      <ul
                        className={`ml-8 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                          isSettingsDropdownOpen
                            ? "max-h-40 opacity-100 mb-5"
                            : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        {settingsItems.map((item, subIndex) => (
                          <li key={subIndex}>
                            <button
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-600 rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gray-900"
                              onClick={() =>
                                handleDropdownItemClick(item.component)
                              }
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <button
                      className={`flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-800 rounded-md transition duration-300 ease-in-out transform hover:scale-105 ${
                        activeComponent === component ? "bg-gray-900" : ""
                      }`}
                      onClick={() => setActiveComponent(component)}
                    >
                      <Icon className="h-6 w-6 mr-3" />
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main
        className={`flex-1 p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${sidebarOpen ? "ml-64" : "ml-10"}`}
      >
        <button
          className="md:hidden fixed top-4 left-4 p-2 text-gray-800 bg-white rounded-md shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars className="h-6 w-6" />
        </button>
        {activeComponent}
      </main>
    </div>
  );
};
export default AdminPanel;
