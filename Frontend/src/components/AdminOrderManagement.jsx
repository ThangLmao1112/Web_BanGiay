import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button, Option, Select } from "@material-tailwind/react";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import LoadingOverlay from "./LoadingOverlay";

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_LABELS = {
  Pending: "Đang chờ",
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

const toVnd = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0) * 1000);

const AdminOrderManagement = ({ mode = "all" }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/orders/admin/all", { headers });
      const data = response?.data?.data?.orders || [];
      setOrders(data);

      const initialStatuses = {};
      data.forEach((order) => {
        initialStatuses[order._id] = order.status;
      });
      setSelectedStatuses(initialStatuses);
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Không tải được danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchOrders();
  }, [token]);

  const handleStatusUpdate = async (orderId) => {
    const nextStatus = selectedStatuses[orderId];
    if (!nextStatus) {
      ErrorToast("Vui lòng chọn trạng thái.");
      return;
    }

    try {
      await axios.patch(
        `/api/orders/admin/update-status/${orderId}`,
        { status: nextStatus },
        { headers }
      );
      SuccessToast("Cập nhật trạng thái thành công.");
      fetchOrders();
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Không thể cập nhật trạng thái đơn.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`/api/orders/admin/cancel/${orderId}`, {}, { headers });
      SuccessToast("Hủy đơn hàng thành công.");
      fetchOrders();
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Không thể hủy đơn hàng.");
    }
  };

  const displayedOrders = useMemo(() => {
    if (mode === "view") {
      return orders.filter((order) => order.status !== "Cancelled");
    }
    if (mode === "cancel") {
      return orders.filter(
        (order) => order.status !== "Cancelled" && order.status !== "Delivered"
      );
    }
    return orders;
  }, [mode, orders]);

  if (!token) {
    return <p className="text-red-600">Bạn cần đăng nhập admin để dùng chức năng này.</p>;
  }

  return (
    <div className="p-4">
      {loading && <LoadingOverlay />}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
        <Button className="bg-gray-800" onClick={fetchOrders}>
          Tải lại
        </Button>
      </div>

      {displayedOrders.length === 0 ? (
        <p className="text-gray-600">Chưa có đơn hàng phù hợp.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Mã đơn</th>
                <th className="px-3 py-2 text-left">Khách hàng</th>
                <th className="px-3 py-2 text-left">Tổng tiền</th>
                <th className="px-3 py-2 text-left">Thanh toán</th>
                <th className="px-3 py-2 text-left">Trạng thái</th>
                <th className="px-3 py-2 text-left">Ngày tạo</th>
                <th className="px-3 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order._id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{order._id}</td>
                  <td className="px-3 py-2">
                    {order.user
                      ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || order.user.email
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2">{toVnd(order.totalAmount)}</td>
                  <td className="px-3 py-2">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                  </td>
                  <td className="px-3 py-2">{STATUS_LABELS[order.status] || order.status}</td>
                  <td className="px-3 py-2">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="px-3 py-2">
                    {mode === "update" ? (
                      <div className="flex min-w-[260px] items-center gap-2">
                        <div className="w-40">
                          <Select
                            value={selectedStatuses[order._id] || order.status}
                            onChange={(value) =>
                              setSelectedStatuses((prev) => ({
                                ...prev,
                                [order._id]: value || order.status,
                              }))
                            }
                            label="Trạng thái"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <Option key={status} value={status}>
                                {STATUS_LABELS[status] || status}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-700"
                          onClick={() => handleStatusUpdate(order._id)}
                        >
                          Lưu
                        </Button>
                      </div>
                    ) : mode === "cancel" ? (
                      <Button
                        size="sm"
                        className="bg-red-600"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Hủy đơn
                      </Button>
                    ) : (
                      <span className="text-gray-500">Xem</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
