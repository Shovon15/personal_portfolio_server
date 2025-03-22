import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import {
  createCvLink,
  deleteCvLink,
  getCvLink,
  getCvLinkByEnabled,
  updateCvLink,
} from "../controller/cvController";

const cvRouter = Router();

cvRouter.post("/", isAuthenticated, createCvLink);
cvRouter.put("/:_id", isAuthenticated, updateCvLink);
cvRouter.get("/", isAuthenticated, getCvLink);
cvRouter.get("/public", getCvLinkByEnabled);
cvRouter.delete("/:_id", isAuthenticated, deleteCvLink);

export default cvRouter;
