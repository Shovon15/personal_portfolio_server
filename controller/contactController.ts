import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ResponseHandler from "../utils/responseHanlder";
import CustomError from "../utils/errorHandler";
import ContactModel from "../models/contactModel";

interface IContact {
    name: string;
    email: string;
    details: string;
}

export const createContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name ,email, details} = req.body as IContact;
    if (!name) {
        throw new CustomError(400, "name is required")
    }
    if (!email) {
        throw new CustomError(400, "email is required")
    }
    if (!details) {
        throw new CustomError(400, "details is required")
    }

    await ContactModel.create({
        name,
       email,
       details
    });

    return res.status(200).json(new ResponseHandler(200, {}, " submitted"));
});


export const getContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const contact = await ContactModel.find({});
    if (contact.length <= 0) {
        throw new CustomError(400, "no contact item found")
    }

    return res.status(200).json(new ResponseHandler(200, { contact }, "contact data return successfully"));
});

