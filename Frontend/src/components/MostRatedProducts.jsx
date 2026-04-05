import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";

const CATEGORY_LABELS = {
  all: "Tất cả",
  "Gents Footwear": "Giày nam",
  "Ladies Footwear": "Giày nữ",
};

const toVnd = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0) * 1000);

const MostRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const setProductGroups = (productData) => {
    const data = Array.isArray(productData)
      ? productData.map((product) => ({
          product,
          averageRating: Number(product?.averageRating) || 5,
          images: product.images || [],
        }))
      : [];

    const uniqueCategories = [...new Set(data.map((p) => p.product.category))];
    setCategories(uniqueCategories);
    setProducts(data);
    setFilteredProducts(data.sort((a, b) => b.averageRating - a.averageRating));
    setSelectedCategory("all");
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          "/api/products/all-products?page=1&limit=100"
        );
        const productData = response?.data?.data?.ProductDetails || [];
        setProductGroups(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductGroups([]);
      }
    };

    fetchAllProducts();
  }, []);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) {
      return;
    }
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) {
      return;
    }
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const updatedFilteredProducts = (category === "all" ? products : products.filter((p) => p.product.category === category))
      .sort((a, b) => b.averageRating - a.averageRating);

    setFilteredProducts(updatedFilteredProducts);
  };

  const handleViewProduct = (product) => {
    navigate(`/detailedProduct/${product.product._id}`);
  };
  return (
    <div className=" mx-auto p-4">
      <div className="mb-4 ">
        <div className="flex justify-center items-center gap-5 mb-4 ">
          <Button
            onClick={() => handleCategoryChange("all")}
            className={`text-gray-800 ${selectedCategory === "all" ? "bg-gray-300" : "bg-gray-600 text-white"}`}
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`text-gray-800 ${selectedCategory === category ? "bg-gray-300" : "bg-gray-600 text-white"}`}
            >
              {CATEGORY_LABELS[category] || category}
            </Button>
          ))}
        </div>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-6 pb-4 scroll-smooth hide-scroll-bar"
          >
            {filteredProducts.length === 0 ? (
              <div className="w-full rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                Chưa có sản phẩm để hiển thị.
              </div>
            ) : filteredProducts.map((product) => (
              <Card
                key={product.product._id}
                className="h-[25rem] w-[17rem] sm:h-[30rem] sm:w-[22rem] md:h-[35rem] md:w-[24rem] flex-shrink-0 "
              >
                <CardHeader
                  shadow={false}
                  floated={false}
                  className="h-1/2 sm:h-1/2 md:h-full lg:h-full xl:h-full "
                >
                  <img
                    src={product.images?.[0] || "https://placehold.co/600x400?text=Shoe"}
                    alt={product.product.name}
                    className="h-full w-full object-cover "
                  />
                </CardHeader>

                <CardBody>
                  <div className="mb-2 flex items-center justify-between">
                    <Typography
                      color="blue-gray"
                      className="font-medium text-sm sm:text-base md:text-lg lg:text-xl"
                    >
                      {product.product.name}
                    </Typography>
                    <Typography
                      color="blue-gray"
                      className=" text-sm sm:text-base md:text-sm lg:text-lg"
                    >
                      {toVnd(product.product.price)}
                    </Typography>
                  </div>
                </CardBody>

                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handleViewProduct(product)}
                    ripple={false}
                    fullWidth={true}
                    className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                  >
                    Xem sản phẩm
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredProducts.length > 0 && (
            <>
              <IconButton
                onClick={scrollLeft}
                className="absolute bottom-80 left-2 transform  bg-white/60 text-black z-10 text-lg"
              >
                <TiArrowLeftThick />
              </IconButton>
              <IconButton
                onClick={scrollRight}
                className="absolute bottom-[23rem] left-[93%] transform  bg-white/60 text-black z-10 text-lg"
              >
                <TiArrowRightThick />
              </IconButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MostRatedProducts;
