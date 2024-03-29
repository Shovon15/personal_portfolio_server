import { Router } from "express";
import { createCategory, deleteCategory, getCategory, getCategoryByEnabled, updateCategory } from "../controller/categoryController";
import { isAuthenticated } from "../middleware/auth.middleware";


const categoryRouter = Router();

categoryRouter.post("/", isAuthenticated, createCategory);
categoryRouter.put("/:_id", isAuthenticated, updateCategory);
categoryRouter.get("/", isAuthenticated, getCategory);
categoryRouter.get("/public", getCategoryByEnabled);
categoryRouter.delete("/:_id", isAuthenticated, deleteCategory);



export default categoryRouter;
