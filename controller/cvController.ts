import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ResponseHandler from "../utils/responseHanlder";
import CustomError from "../utils/errorHandler";
import CvModel, { ICv } from "../models/cvModel";

interface UpdateFields {
  link?: string;
  isEnabled?: boolean;
}
export const updateCvLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const _id = req.params._id;

    const updateFields: UpdateFields = {};

    if (formData.link !== undefined) {
      updateFields.link = formData.link;
    }

    if (formData.isEnabled !== undefined) {
      updateFields.isEnabled = formData.isEnabled;
    }

    const updatedData = await CvModel.findOneAndUpdate(
      { _id },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedData) {
      throw new CustomError(404, "Cv Link data not found.");
    }

    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "CV Link updated successfully"));
  },
);

export const createCvLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { link } = req.body as ICv;

    if (!link) {
      throw new CustomError(400, "link is required");
    }

    await CvModel.create({
      link,
    });

    return res
      .status(200)
      .json(new ResponseHandler(200, { link }, "CV link create successfully"));
  },
);

export const getCvLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingCv = await CvModel.find({});

    if (existingCv.length <= 0) {
      throw new CustomError(400, "no cv link found");
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { cv: existingCv },
          "cv link return successfully",
        ),
      );
  },
);

export const getCvLinkByEnabled = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingCv = await CvModel.findOne({ isEnabled: true });

    if (!existingCv) {
      throw new CustomError(400, "No CV link found");
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { data: existingCv },
          "CV link returned successfully",
        ),
      );
  },
);

export const deleteCvLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params._id;

    const existingCv = await CvModel.findById({ _id });

    if (!existingCv) {
      // Category not found, send custom error
      return new CustomError(404, "Cv Link not found");
    }

    // Category found, delete it
    await existingCv.deleteOne({ _id });
    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "Cv Link deleted successfully"));
  },
);
