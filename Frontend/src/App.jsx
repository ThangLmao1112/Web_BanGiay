import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddProductForm from "./components/AddProductForm";
import AdminPanel from "./pages/AdminPanel";
import ProductList from "./components/ProductCards";
import UserList from "./components/UserList";
import UserDeleteList from "./components/UserDeleteList";
import MostActiveUsers from "./components/MostActiveUsers";
import ManageProducts from "./pages/ManageProducts";
import ProductUpdateForm from "./pages/ProductUpdateForm";
import ProductUpdateImage from "./pages/ProductUpdateImage";
import AllProducts from "./components/AllProducts";
import DetailedProduct from "./components/DetailedProduct";
import MostRatedProducts from "./components/MostRatedProducts";
import CustomerTestimonials from "./components/Testimonials";
import Layout from "./components/Layout";
import ContactUs from "./components/ContactUs";
import AboutUs from "./pages/AboutUs";
import Cart from "./pages/Cart";
import GentsFootwear from "./pages/GentsFootwear";
import LadiesFootwear from "./pages/LadiesFootwear";
import FindUs from "./components/FindUs";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import TrackOrder from "./pages/TrackOrder";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />} >
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/detailedProduct/:productId" element={<DetailedProduct />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/gentsFootwear" element={<GentsFootwear />} />
        <Route path="/ladiesFootwear" element={<LadiesFootwear />} />
        <Route path="/findUs" element={<FindUs />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderConfirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/track-order" element={<TrackOrder />} />
        
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addProduct" element={<AddProductForm />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
        <Route path="/productCards" element={<ProductList />} />
        <Route path="/manageProducts" element={<ManageProducts />} />
        <Route path="/updateProductDetails" element={<ProductUpdateForm />} />
        <Route path="/updateProductImages" element={<ProductUpdateImage />} />
        <Route path="/mostRatedProducts" element={<MostRatedProducts />} />
        <Route path="/allUsers" element={<UserList />} />
        <Route path="/removeUser" element={<UserDeleteList />} />
        <Route path="/mostActiveUsers" element={<MostActiveUsers />} />
        <Route path="/testimonials" element={<CustomerTestimonials/>} />
      </Routes>
    </Router>
  );
}

export default App;
