import React, { useState, useEffect } from "react";
import axios from 'axios';
import { NavLink } from "react-router-dom";
import logo from "../assets/webs-log.png";
import AvatarWithUserDropdown from "../components/AvatarWithUserDropdown";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Input,
  Button,
  Badge
} from "@material-tailwind/react";
import { HiBars3, HiOutlineXMark } from "react-icons/hi2";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function NavListMenu({ label, menuItems }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderItems = menuItems.map(({ title, path }, key) => (
    <MenuItem className="rounded-lg p-2 hover:bg-transparent" key={key}>
      {path ? (
        <NavLink to={path}>
          <Typography
            variant="h6"
            color="blue-gray"
            className="text-sm font-bold"
          >
            {title}
          </Typography>
        </NavLink>
      ) : (
        <Typography
          variant="h6"
          color="blue-gray"
          className="text-sm font-bold"
        >
          {title}
        </Typography>
      )}
    </MenuItem>
  ));

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              {label}
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid gap-y-2 outline-none outline-0">{renderItems}</ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}


function NavList({ navItems }) {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      {navItems.map((item) => (
        <NavListMenu key={item.label} label={item.label} menuItems={item.menuItems} />
      ))}
    </List>
  );
}

const Header = ({ onSearchClick, searchVisible }) => {
  const [openNav, setOpenNav] = useState(false);
  const [navbarPosition, setNavbarPosition] = useState("top-8");
  const [navbarHeight, setNavbarHeight] = useState("h-[8rem]");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFirstName, setUserFirstName] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const t = {
    freeDelivery: "Miễn phí giao hàng cho đơn từ Rs.3000 trở lên",
    gentsFootwear: "GIÀY NAM",
    ladiesFootwear: "GIÀY NỮ",
    newArrivals: "HÀNG MỚI VỀ 24",
    sale: "KHUYẾN MÃI",
    shoes: "GIÀY",
    sandals: "SANDAL",
    slippers: "DÉP",
    sneakers: "SNEAKER",
    pumps: "GIÀY CAO GÓT",
    trackOrder: "Theo dõi đơn hàng",
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    searchLabel: "Nhập để tìm",
    searchPlaceholder: "Tìm theo tên sản phẩm",
    searchButton: "Tìm",
    searchError: "Vui lòng nhập tên sản phẩm để tìm kiếm.",
  };

  const navItems = [
    {
      label: t.gentsFootwear,
      menuItems: [
        { title: t.shoes, path: "/gentsShoes" },
        { title: t.sandals, path: "/gentsSandals" },
        { title: t.slippers, path: "/gentsSlippers" },
        { title: t.sneakers, path: "/gentsSneakers" },
      ],
    },
    {
      label: t.ladiesFootwear,
      menuItems: [
        { title: t.sandals, path: "/ladiesSandals" },
        { title: t.pumps, path: "/ladiesPumps" },
        { title: t.sneakers, path: "/ladiesSneakers" },
        { title: t.shoes, path: "/ladiesShoes" },
        { title: t.slippers, path: "/ladiesSlippers" },
      ],
    },
    {
      label: t.newArrivals,
      menuItems: [
        { title: t.gentsFootwear, path: "/gentsNewArrivals" },
        { title: t.ladiesFootwear, path: "/ladiesNewArrivals" },
      ],
    },
    {
      label: t.sale,
      menuItems: [{ title: t.gentsFootwear }, { title: t.ladiesFootwear }],
    },
  ];

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

  useEffect(() => {
    const fetchTotalItems = async () => {
      if (!userId) {
        setErrorMessage("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/cart/total-items/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setTotalItems(response.data.data.totalItems);
      } catch (error) {
        setErrorMessage("Failed to fetch total items");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalItems();
  }, [userId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarPosition("top-0");
        setNavbarHeight("h-[4rem]");
      } else {
        setNavbarPosition("top-8");
        setNavbarHeight("h-[8rem]");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage(t.searchError);
      setInterval(() => {
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
      <h1 className="flex bg-black text-white h-8 justify-center items-center">
        {t.freeDelivery}
      </h1>
      <Navbar
        className={`fixed ${navbarPosition} left-0 right-0 z-50 mx-auto max-w-screen-3xl px-4 py-2 ${navbarHeight} transition-all duration-300`}
      >
        <div className="flex items-center justify-between text-blue-gray-900 h-full">
          <div>
            <img
              className={`w-24 sm:w-22 md:w-40 lg:w-30 xl:w-40 2xl:w-54 h-auto transition-all duration-300 cursor-pointer`}
              src={logo}
              onClick={handleHomeNavigate}
              alt="Logo"
            />
          </div>

          <div className="flex flex-1 items-center gap-4 justify-center">
            <div className="hidden lg:block">
              <NavList navItems={navItems} />
            </div>
            <Typography className="hidden lg:block text-sm">
              {t.trackOrder}
            </Typography>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                {userFirstName && (
                  <Typography className="flex items-center mr-5">
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
          </div>
          <div className="hidden gap-2 lg:flex items-center mr-2">
            <div className="">
              <IconButton className="bg-white" onClick={onSearchClick}>
                <CiSearch style={{ color: "black", fontSize: "2.5em" }} />
              </IconButton>
            </div>

            <div
              className={`absolute inset-x-0 mx-auto w-1/2 bg-white/80 p-2 shadow-lg transition-all duration-500 ease-in-out top-full rounded-sm mt-1  ${
                searchVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
              }`}
              style={{ maxWidth: "600px" }}
            >
              {" "}
              <form onSubmit={handleSearchSubmit} className="flex">
                <Input
                  variant="standard"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  label={t.searchLabel}
                  placeholder={t.searchPlaceholder}
                  className="w-full p-2 border border-gray-300 rounded-md border-none"
                  min={1}
                />
                <div className="flex flex-col">
                  <Button type="submit" className="">
                    {t.searchButton}
                  </Button>
                </div>
              </form>
              {errorMessage && (
                <p
                  className={`absolute inset-x-0 mx-auto w-2/3 bg-white/80 text-red-500 text-sm text-center font-semibold p-2 shadow-lg transition-all duration-900 ease-in-out top-full rounded-sm mt-1  ${
                    searchVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{ maxWidth: "600px" }}
                >
                  {errorMessage}
                </p>
              )}
            </div>
            {/* CiShoppingCart */}
              <Badge content={totalItems} withBorder>
              <IconButton className="bg-white" onClick={handleCart}>
              <CiShoppingCart style={{ color: "black", fontSize: "2.5em" }} />
            </IconButton>
            </Badge>
            
          </div>
          <div className="flex items-center">
            <button
              color="white"
              className="lg:hidden mr-1"
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <HiOutlineXMark className="h-6 w-6" strokeWidth={2} />
              ) : (
                <HiBars3 className="h-6 w-6" strokeWidth={2} />
              )}
            </button>
            {isAuthenticated ? (
              <div className="w-full flex items-center justify-center">
                <AvatarWithUserDropdown />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <Collapse open={openNav}>
          <div className="bg-white pb-5">
            <NavList navItems={navItems} />
            <Typography className="text-black -mt-5 mb-2 ml-3">
              {t.trackOrder}
            </Typography>
            <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
              <IconButton className="bg-white">
                <CiSearch style={{ color: "black", fontSize: "2.5em" }} />
              </IconButton>
              <IconButton className="bg-white">
                <CiShoppingCart style={{ color: "black", fontSize: "2.5em" }} />
              </IconButton>
            </div>
          </div>
        </Collapse>
      </Navbar>
      <div className="pt-[8rem]"></div>
    </div>
  );
};
export default Header;
