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

import { FaPowerOff } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { RiShieldCheckFill } from "react-icons/ri";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { FaRegCompass } from "react-icons/fa";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatarGif2 from "../assets/boypic.avif";

const profileMenuItemsBase = [
  {
    label: "Hồ sơ của tôi",
    icon: FaUserCircle,
    path: "/profile",
  },
  {
    label: "Hộp thư",
    icon: MdOutlineLocalPostOffice,
    path: "/inbox",
  },
  {
    label: "Theo dõi đơn hàng",
    icon: FaRegCompass,
    path: "/track-order",
  },
];

const AvatarWithUserDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const role = response?.data?.data?.role;
        setIsAdmin(role === "admin");
      } catch (error) {
        setIsAdmin(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout", null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Đăng xuất thành công!");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleMenuItemClick = ({ label, path }) => {
    if (label === "Đăng xuất") {
      handleLogout();
    } else if (label === "Bảng quản trị") {
      navigate("/adminPanel");
    } else if (path) {
      navigate(path);
    }
    closeMenu();
  };

  const profileMenuItems = [
    ...profileMenuItemsBase,
    ...(isAdmin
      ? [
          {
            label: "Bảng quản trị",
            icon: RiShieldCheckFill,
            path: "/adminPanel",
          },
        ]
      : []),
    {
      label: "Đăng xuất",
      icon: FaPowerOff,
    },
  ];

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
            alt="user avatar"
            withBorder={true}
            color="blue-gray"
            className="p-0.5 w-full sm:h-10 md:w-13 md:h-13 lg:w-15 lg:h-15 xl:w-18 xl:h-18"
            src={avatarGif2}
          />
        </Button>
      </MenuHandler>
      <MenuList className="min-w-[230px] rounded-xl border border-blue-gray-100 p-2 shadow-lg">
        {profileMenuItems.map(({ label, icon, path }) => {
          return (
            <MenuItem
              key={label}
              onClick={() => handleMenuItemClick({ label, path })}
              className={`flex items-center gap-3 rounded-md py-2.5 px-3 ${
                label === "Đăng xuất"
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : "hover:bg-blue-gray-50"
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
};

export default AvatarWithUserDropdown;
