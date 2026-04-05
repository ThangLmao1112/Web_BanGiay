import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { NavLink } from "react-router-dom";
import logo from "../assets/webs-log.png";
import AvatarWithUserDropdown from "../components/AvatarWithUserDropdown";
import {
  Navbar,
  Typography,
  IconButton,
  Input,
  Button,
  Badge
} from "@material-tailwind/react";
import { CiShoppingCart } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
const Header = () => {
  const [navbarHeight, setNavbarHeight] = useState("h-[8rem]");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFirstName, setUserFirstName] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const t = {
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    searchLabel: "Nhập để tìm",
    searchPlaceholder: "Tìm theo tên sản phẩm",
    searchButton: "Tìm",
    searchError: "Vui lòng nhập tên sản phẩm để tìm kiếm.",
  };

  useEffect(() => {
    const fetchUserFirstName = async () => {
      try {
        const response = await axios.get("/api/users/get-user-first-name", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserFirstName(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user's first name:", error);
        setIsAuthenticated(false);
      }
    };
    fetchUserFirstName();
  }, []);

  const fetchTotalItems = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setTotalItems(0);
      return;
    }

    try {
      const response = await axios.get(`/api/cart/total-items/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalItems(response?.data?.data?.totalItems || 0);
    } catch (error) {
      setTotalItems(0);
      console.error("Failed to fetch cart total items:", error);
    }
  }, []);

  useEffect(() => {
    fetchTotalItems();
  }, [fetchTotalItems, location.pathname]);

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchTotalItems();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [fetchTotalItems]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarHeight("h-[4rem]");
      } else {
        setNavbarHeight("h-[8rem]");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage(t.searchError);
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    navigate(`/allProducts?search=${encodeURIComponent(searchQuery)}`);
  };
  const handleHomeNavigate = () => {
    navigate("/");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <div>
      <Navbar
        className={`fixed top-0 left-0 right-0 z-50 mx-auto max-w-screen-3xl px-4 py-2 ${navbarHeight} transition-all duration-300`}
      >
        <div className="flex items-center justify-between gap-4 text-blue-gray-900 h-full">
          <div className="shrink-0">
            <img
              className={`w-24 sm:w-22 md:w-40 lg:w-30 xl:w-40 2xl:w-54 h-auto transition-all duration-300 cursor-pointer`}
              src={logo}
              onClick={handleHomeNavigate}
              alt="Logo"
            />
          </div>

          <div className="hidden md:flex flex-1 justify-center px-2 lg:px-6">
            <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl items-center gap-2">
              <Input
                variant="outlined"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label={t.searchLabel}
                placeholder={t.searchPlaceholder}
                className="w-full"
              />
              <Button type="submit">{t.searchButton}</Button>
            </form>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {isAuthenticated ? (
              <>
                {userFirstName && (
                  <Typography className="hidden sm:flex items-center">
                    {userFirstName}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <div className="flex justify-center items-center">
                    <div className=" w-2 max-h-6 bg-black sm:h-9 md:h-9 "></div>
                    <Typography className="p-2 text-sm sm:text-sm md:text-sm lg:lg xl:lg ">
                      {t.signIn}
                    </Typography>
                  </div>
                </NavLink>

                <NavLink to="/register">
                  <div className="flex justify-center items-center">
                    <div className="w-2 max-h-6 bg-black  sm:h-9 md:h-9 "></div>
                    <Typography className="p-2 text-sm sm:text-sm md:text-sm lg:lg xl:lg ">
                      {t.signUp}
                    </Typography>
                  </div>
                </NavLink>
              </>
            )}

            <Badge content={totalItems} withBorder>
              <IconButton className="bg-white" onClick={handleCart}>
                <CiShoppingCart style={{ color: "black", fontSize: "2.5em" }} />
              </IconButton>
            </Badge>

            {isAuthenticated ? (
              <div className="w-full flex items-center justify-center">
                <AvatarWithUserDropdown />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="md:hidden mt-3 px-1">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <Input
              variant="outlined"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label={t.searchLabel}
              placeholder={t.searchPlaceholder}
              className="w-full"
            />
            <Button type="submit">{t.searchButton}</Button>
          </form>
          {errorMessage && (
            <p className="mt-2 text-red-500 text-sm font-semibold">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="hidden md:block">
          {errorMessage && (
            <p className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white/90 text-red-500 text-sm text-center font-semibold p-2 shadow rounded-sm">
              {errorMessage}
            </p>
          )}
        </div>
      </Navbar>
      <div className="pt-[8rem]"></div>
    </div>
  );
};
export default Header;
