import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgoutPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getOrderByIdController,
  orderStatusPaidController,
  getAllUsersController,
  getTotalUsersController,
  getTotalCategoriesController,
  getTotalOrders,
  getTotalProductsController,
  validateToken,
  resetPasswordController,
  updatePasswordController

} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { getWeeklyOrders, getMonthlyOrders } from "../controllers/productController.js";

//OBJETO RUTA
const router = express.Router();

//ENPOINTS
//REGISTRAR USUARIO
router.post("/register", registerController);

//INICIA SESIÓN
router.post("/login", loginController);



//PROBAR AUTETICACIÓN DE RUTA
router.get("/test", requireSignIn, isAdmin, testController);

//PROTEGER RUTA
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//PROTEGER RUTA ADMIN
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//ACTUALIZAR PERFIL
router.put("/profile", requireSignIn, updateProfileController);

//OBTENER ORDENES DE CLIENTE
router.get("/orders", requireSignIn, getOrdersController);
router.post("/forgot-password", forgoutPasswordController);
router.post("/validate-token", validateToken);
router.post("/reset-password", resetPasswordController)

//OBTENER UNA ORDEN EN ESPECIFICO
router.get("/order/:id", requireSignIn ,getOrderByIdController)

//OBTENER TODAS LAS ORDES PARA ADMINISTRADOR 
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);


// ACTUALIZAR CLAVE
router.put(
  "/update-password",
  requireSignIn, 
  updatePasswordController
);

// ACTUALIZAR ESTADO DE LA ORDEN
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

router.put(
  "/update-isPaid/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusPaidController
);

router.get(
  "/all-users",
  requireSignIn,
  isAdmin,
  getAllUsersController
);

router.get(
  "/total-users",
  requireSignIn,
  isAdmin,
  getTotalUsersController
);

router.get(
  "/total-categories",
  requireSignIn,
  isAdmin,
  getTotalCategoriesController
);

router.get(
  "/total-orders",
  requireSignIn,
  isAdmin,
  getTotalOrders
);

router.get(
  "/total-products",
  requireSignIn,
  isAdmin,
  getTotalProductsController
);

router.get(
  "/order-daily",
  requireSignIn,
  isAdmin,
  getWeeklyOrders
);

router.get(
  "/order-monthly",
 
  getMonthlyOrders
);

export default router;
