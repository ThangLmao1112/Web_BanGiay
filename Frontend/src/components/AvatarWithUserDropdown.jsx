import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";

import { FaCog } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { IoHelpCircleSharp } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { RiShieldCheckFill } from "react-icons/ri";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatarGif from "../assets/womangif.gif";
import avatarGif2 from "../assets/boypic.avif";
const profileMenuItemsBase = [
  {
    label: "Hồ sơ của tôi",
    icon: FaUserCircle,
  },
  {
    label: "Chỉnh sửa hồ sơ",
    icon: FaCog,
  },
  {
    label: "Hộp thư",
    icon: AiOutlineDownload,
  },
  {
    label: "Trợ giúp",
    icon: IoHelpCircleSharp,
  },
];

const AvatarWithUserDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/users/get-user-details");
        if (response.data.data.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      toast.success("Đăng xuất thành công!");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };
  
  const handleMenuItemClick = (label) => {
    if (label === "Đăng xuất") {
      handleLogout();
    } else if (label === "Bảng quản trị") {
      navigate("/adminPanel");
    }
    closeMenu();
  };

  const closeMenu = () => setIsMenuOpen(false);
  const profileMenuItems = [
    ...profileMenuItemsBase,
    ...(isAdmin
      ? [
          {
            label: "Bảng quản trị",
            icon: RiShieldCheckFill,
          },
        ]
      : []),
    {
      label: "Đăng xuất",
      icon: FaPowerOff,
    },
  ];

  const filteredMenuItems = isAdmin
    ? profileMenuItems.filter((item) => item.label !== "Trợ giúp")
    : profileMenuItems;

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center rounded-full p-0 "
        >
          <Avatar
            variant="circular"
            // size="md"
            alt="tania andrew"
            withBorder={true}
            color="blue-gray"
            className="p-0.5 w-full sm:h-10 md:w-13 md:h-13 lg:w-15 lg:h-15 xl:w-18 xl:h-18"
            src={avatarGif2}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {filteredMenuItems.map(({ label, icon }, key) => {
          return (
            <MenuItem
              key={label}
              onClick={() => handleMenuItemClick(label)}
              className={`flex items-center gap-2 rounded ${
                label === "Đăng xuất"
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${
                  label === "Đăng xuất" ? "text-red-500" : ""
                }`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={label === "Đăng xuất" ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
      <ToastContainer />
    </Menu>
  );
}
export default AvatarWithUserDropdown
