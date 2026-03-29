import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  List,
  ListItem,
} from "@material-tailwind/react";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { totalAmount, paymentMethod, shippingAddress, cartItems } =
    state || {};

  const handleBackToShop = () => {
    navigate("/allProducts");
  };

  return (
    <div className="max-w-screen-lg mx-auto p-5">
      <Card className="border border-black p-5">
        <CardBody>
          <p className="text-2xl text-center mb-6 font-semibold">
            Cảm ơn bạn đã đặt hàng!
          </p>

          <p variant="body1" className="text-center mb-6">
            Đơn hàng của bạn đã được ghi nhận thành công và đang được xử lý.
            Bạn sẽ sớm nhận được email xác nhận.
          </p>

          {/* Order Summary */}
          <p variant="h5" className="mb-4 font-semibold">
            Tóm tắt đơn hàng:
          </p>
          <div className="mb-2">
            {cartItems?.map((item, index) => (
              <div
                key={`${item.productDetails._id}-${index}`}
                className="flex justify-start mb-2 gap-8"
              >
                <span>{item.productDetails.name}</span>
                <span>Rs {item.productDetails.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-start gap-8 font-semibold text-lg mt-4">
              <span>Tổng tiền:</span>
              <span>Rs {totalAmount}</span>
            </div>
          </div>
          <hr />

          {/* Shipping and Payment Details */}
          <p variant="h5" className="mb-2 font-semibold mt-2">
            Giao hàng và thanh toán:
          </p>
          <List>
            <ListItem className="flex gap-8">
              <strong>Địa chỉ giao hàng:</strong> {shippingAddress}
            </ListItem>
            <ListItem className="flex gap-8">
              <strong>Phương thức thanh toán:</strong> {paymentMethod}
            </ListItem>
          </List>

          <div className="flex justify-center mt-5">
            <Button
              onClick={handleBackToShop}
              className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition duration-300"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
