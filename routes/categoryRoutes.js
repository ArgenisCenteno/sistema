import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryControlller,
  createCategoryController,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
} from "./../controllers/categoryController.js";

const router = express.Router();

//RUTAS
// CREAR CATEGORÍA
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//ACTUALIZAR CATEGORÍA
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//OBTENER TODAS LAS CATEGORÍAS
router.get("/get-category", categoryControlller);

//CATEGORÍA INDIVIDUAL
router.get("/single-category/:slug", singleCategoryController);

//ELIMINAR CATEGORIA
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryCOntroller
);

export default router;
