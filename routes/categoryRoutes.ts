import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryByEnabled,
  getCategoryById,
  updateCategory,
} from "../controller/categoryController";
import { isAuthenticated } from "../middleware/auth.middleware";

const categoryRouter = Router();

categoryRouter.get("/", isAuthenticated, getCategory);
categoryRouter.get("/public", getCategoryByEnabled);
categoryRouter.get("/single/:_id", getCategoryById);
categoryRouter.post("/", isAuthenticated, createCategory);
categoryRouter.put("/:_id", isAuthenticated, updateCategory);
categoryRouter.delete("/:_id", isAuthenticated, deleteCategory);

export default categoryRouter;
