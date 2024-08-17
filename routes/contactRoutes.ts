import { Router } from "express";
import { createContact, getContact } from "../controller/contactController";

const contactRouter = Router();

contactRouter.post("/", createContact);
contactRouter.get("/", getContact);




export default contactRouter;
