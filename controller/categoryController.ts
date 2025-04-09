import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ResponseHandler from "../utils/responseHanlder";
import CategoryModel from "../models/categoryModel";
import CustomError from "../utils/errorHandler";

export interface ICategory {
  name: string;
  precedence: string;
}
interface UpdateFields {
  name?: string;
  precedence?: string;
  isEnabled?: boolean;
}
export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const _id = req.params._id;

    const updateFields: UpdateFields = {};

    if (formData.name !== undefined) {
      updateFields.name = formData.name;
    }
    if (formData.precedence !== undefined) {
      updateFields.precedence = formData.precedence;
    }

    if (formData.isEnabled !== undefined) {
      updateFields.isEnabled = formData.isEnabled;
    }

    const updatedData = await CategoryModel.findOneAndUpdate(
      { _id },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedData) {
      throw new CustomError(404, "Category data not found.");
    }

    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "category updated successfully"));
  },
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { name, precedence } = req.body as ICategory;

    if (!name) {
      throw new CustomError(400, "category name is required");
    }

    const processedName = name.trim().replace(/\s+/g, "_").toLowerCase();

    // If no precedence is provided, auto-calculate it
    if (!precedence) {
      const categories = await CategoryModel.find().sort({ precedence: -1 });

      if (categories.length > 0) {
        const lastPrecedence = parseInt(categories[0].precedence || "0", 10);
        precedence = (lastPrecedence + 1).toString(); // convert back to string if schema expects string
      } else {
        precedence = "1"; // first category if none exists
      }
    }

    await CategoryModel.create({
      name,
      precedence,
      value: processedName,
    });

    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "category created successfully"));
  },
);

export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await CategoryModel.find({}).sort({
      precedence: 1,
    });
    if (category.length <= 0) {
      throw new CustomError(400, "no category item found");
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(200, { category }, "category return successfully"),
      );
  },
);
export const getCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const data = await CategoryModel.findById({ _id });
    if (!data) {
      throw new CustomError(400, "no category data found");
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { category: data },
          "single category return successfully",
        ),
      );
  },
);
export const getCategoryByEnabled = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryModel.find({ isEnabled: true }).sort({
      precedence: 1,
    });
    if (categories.length <= 0) {
      throw new CustomError(400, "no category item found");
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { data: categories },
          "category return successfully",
        ),
      );
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params._id;

    const category = await CategoryModel.findById({ _id });

    if (!category) {
      // Category not found, send custom error
      return new CustomError(404, "Category not found");
    }

    // Category found, delete it
    await category.deleteOne({ _id });
    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "category deleted successfully"));
  },
);
