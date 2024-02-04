import express from "express";
import { 
  createOrderController,
  createProductController,
  deleteProductController,
  getFilteredOrders,
  getProductByGender,
  getProductController,
  getSingleProductController,
  getTopSaleProducts,
  payWithBank,
  paypalPayController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//OBTENER PRODUCTO
router.get("/get-product", getProductController);

//OBTENER PRODUCTO INDIVIDUAL
router.get("/get-product/:slug", getSingleProductController);

//OBTENER IMAGEN
router.get("/product-photo/:pid", productPhotoController);

//OBTENER PRODUCTO POR GENERO
router.get("/product-gender/:name", getProductByGender)

//ELIMINAR PRODUCTO
router.delete("/delete-product/:pid", deleteProductController);

//FILTRAR PRODUCTOS
router.post("/product-filters", productFiltersController);

//CONTAR PRODUCTOS
router.get("/product-count", productCountController);

//PRODUCTOS POR PAGINA
router.get("/product-list/:page", productListController);

//BUSCAR PRODUCTO
router.get("/search/:keyword", searchProductController);

//BUSCAR PRODUCTOS SIMILARES
router.get("/related-product/:pid/:cid", realtedProductController);

//A QUE CATEGORÍA PERTENECE UN PRODUCTO
router.get("/product-category/:slug", productCategoryController);
router.get("/product-sales", getTopSaleProducts);

//RUTA DE PAGOS
 
router.post("/paypal-pay", requireSignIn, paypalPayController)
router.post("/paywithbank", requireSignIn, payWithBank)
router.post("/create-order", requireSignIn, createOrderController)
router.get("/getFilterOrders/:dateRange", getFilteredOrders)

export default router;
 