import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const toVnd = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0) * 1000);

const STATUS_LABELS = {
  Pending: "Đang chờ xử lý",
  Processing: "Đang xử lý",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

const PAYMENT_METHOD_LABELS = {
  "Credit Card": "Thẻ tín dụng",
  JazzCash: "JazzCash",
  EasyPaisa: "EasyPaisa",
  "Cash on Delivery": "Thanh toán khi nhận hàng",
};

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Bạn cần đăng nhập để theo dõi đơn hàng.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Không thể tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Theo dõi đơn hàng</h1>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-red-600 mb-3">{error}</p>
          <Link className="text-blue-600 hover:underline" to="/login">
            Đi đến đăng nhập
          </Link>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-700 mb-3">Bạn chưa có đơn hàng nào.</p>
          <Link className="text-blue-600 hover:underline" to="/allProducts">
            Tiếp tục mua sắm
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <p className="text-sm text-gray-500 break-all">Mã đơn: {order._id}</p>
                <p className="text-sm font-medium text-blue-gray-900">
                  {STATUS_LABELS[order.status] || order.status}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {(order.products || []).map((item, index) => (
                  <div key={`${order._id}-${index}`} className="flex justify-between text-sm">
                    <span>{item.productName} x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Tổng tiền:</span> {toVnd(order.totalAmount)}
                </p>
                <p>
                  <span className="font-semibold">Thanh toán:</span>{" "}
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold">Địa chỉ:</span> {order.shippingAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
