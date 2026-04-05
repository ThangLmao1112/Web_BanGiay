import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Order } from "../../models/order/order.model.js";
import { Product } from "../../models/product/product.model.js";
import { Cart } from "../../models/cart/cart.model.js";

const createOrder = asyncHandler(async (req, res, next) => {
  const { products, totalAmount, paymentMethod, shippingAddress } = req.body;

  if (!Array.isArray(products) || products.length === 0 || !totalAmount || !paymentMethod || !shippingAddress) {
    throw new ApiError(400, "Please provide all required order details");
  }

  const user = req.user?._id;
  if (!user) {
    throw new ApiError(403, "Unauthorized request");
  }

  const paymentMethodMap = {
    "Thẻ tín dụng": "Credit Card",
    "Thanh toán khi nhận hàng": "Cash on Delivery",
  };

  const normalizedPaymentMethod = paymentMethodMap[paymentMethod] || paymentMethod;

  const acceptedPaymentMethods = [
    "Credit Card",
    "JazzCash",
    "EasyPaisa",
    "Cash on Delivery",
  ];

  if (!acceptedPaymentMethods.includes(normalizedPaymentMethod)) {
    throw new ApiError(400, "Invalid payment method");
  }

  const validatedProducts = [];
  let calculatedTotal = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found`);
    }

    if (item.quantity < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    product.stock -= item.quantity;
    await product.save();

    validatedProducts.push({
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
    });

    calculatedTotal += product.price * item.quantity;
  }

  if (Math.round(calculatedTotal) !== Math.round(Number(totalAmount))) {
    throw new ApiError(400, "Total amount mismatch with product prices");
  }

  const order = await Order.create({
    user,
    products: validatedProducts,
    totalAmount: calculatedTotal,
    paymentMethod: normalizedPaymentMethod,
    shippingAddress,
  });

  if (!order) {
    throw new ApiError(500, "Failed to create the order");
  }

  await Cart.findOneAndDelete({ user });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(403, "Unauthorized request");
  }

  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter)
      .populate({ path: "user", select: "firstName lastName email" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    Order.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        page: safePage,
        limit: safeLimit,
        totalOrders,
        totalPages: Math.ceil(totalOrders / safeLimit) || 1,
      },
      "Admin orders fetched successfully"
    )
  );
});

const updateOrderStatusByAdmin = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const cancelOrderByAdmin = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === "Delivered") {
    throw new ApiError(400, "Delivered orders cannot be cancelled");
  }

  order.status = "Cancelled";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

export {
  createOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  updateOrderStatusByAdmin,
  cancelOrderByAdmin,
};
