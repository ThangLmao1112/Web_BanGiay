import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Order } from "../../models/order/order.model.js";
import { Product } from "../../models/product/product.model.js";
import { Cart } from "../../models/cart/cart.model.js";
import mongoose from "mongoose";

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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

  const validatedProducts = [];
  let calculatedTotal = 0;

  for (const item of products) {
    const product = await Product.findById(item.product).session(session);

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
    await product.save({ session });

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

  const createdOrders = await Order.create(
    [
      {
        user,
        products: validatedProducts,
        totalAmount: calculatedTotal,
        paymentMethod: normalizedPaymentMethod,
        shippingAddress,
      },
    ],
    { session }
  );

  const order = createdOrders[0];

  if (!order) {
    throw new ApiError(500, "Failed to create the order");
  }

  await Cart.findOneAndDelete({ user }, { session });

  await session.commitTransaction();

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export { createOrder };
