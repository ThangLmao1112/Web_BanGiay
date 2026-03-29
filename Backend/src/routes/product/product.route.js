import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";
import {
  addProduct,
  getAllProducts,
  getAllTheImagesByColor,
  getColorsWithImages,
  getImageByColor,
  getImageById,
  getMostRatedProducts,
  getProductById,
  removeProduct,
  updateProductDetails,
  updateProductImagesAndColors,
} from "../../controllers/product/product.controller.js";

const router = Router();
// Routes
router.route("/all-products").get(getAllProducts);
router.route("/product-by-id/:productId").get(getProductById);
router.route("/image-by-id/:imageId").get(getImageById);
router.route("/image-by-color/:productId/:color").get(getImageByColor);
router.route("/colors-with-images/:productId").get(getColorsWithImages);
router.route("/product/:productId").get(getAllTheImagesByColor);
router.route("/most-rated-products").get(getMostRatedProducts);
//Secure Routes
router
  .route("/add-product")
  .post(upload.array("images", 20), verifyJWT, verifyAdmin, addProduct);
router
  .route("/remove-product/:productId")
  .delete(verifyJWT, verifyAdmin, removeProduct);
router
  .route("/update-product-details/:productId")
  .patch(verifyJWT, verifyAdmin, updateProductDetails);
router
  .route("/update-product-images/:productId")
  .patch(
    upload.array("images", 20),
    verifyJWT,
    verifyAdmin,
    updateProductImagesAndColors
  );

export default router;
