import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createProject, deleteProject, getProject, getProjectByCategory, getProjectById, getProjectBySlug, updateProject } from "../controller/projectController";


const projectRouter = Router();

projectRouter.post("/", isAuthenticated, createProject);
projectRouter.put("/:_id", isAuthenticated, updateProject);
projectRouter.get("/all", getProject);
projectRouter.get("/public/:category", getProjectByCategory);
projectRouter.get("/:_id", getProjectById);
projectRouter.get("/slug/:slug", getProjectBySlug);
projectRouter.delete("/:_id", isAuthenticated, deleteProject);



export default projectRouter;
