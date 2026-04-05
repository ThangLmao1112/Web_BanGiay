import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";
import {
	cancelOrderByAdmin,
	createOrder,
	getAllOrdersForAdmin,
	getMyOrders,
	updateOrderStatusByAdmin,
} from "../../controllers/order/order.controller.js";


const router = Router()

router.route("/create").post(verifyJWT, createOrder)
router.route("/my-orders").get(verifyJWT, getMyOrders)
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAllOrdersForAdmin)
router
	.route("/admin/update-status/:orderId")
	.patch(verifyJWT, verifyAdmin, updateOrderStatusByAdmin)
router
	.route("/admin/cancel/:orderId")
	.patch(verifyJWT, verifyAdmin, cancelOrderByAdmin)

export default router