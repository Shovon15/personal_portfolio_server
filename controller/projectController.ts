import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ResponseHandler from "../utils/responseHanlder";
import CustomError from "../utils/errorHandler";
import ProjectModel from "../models/ProjectModel";
import { uploadOnCloudinary } from "../utils/cloudinary";
import generateUniqueSlug from "../utils/generateUniqueSlug";

// interface ICategory {
//     name: string;
// }
interface UpdateFields {
  name?: string;
  title?: string;
  link?: string;
  description?: string;
  category?: string[];
  oldImages?: string[];
  images?: string[];
  isEnabled?: boolean;
}

export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const _id = req.params._id;

    // if ((!formData.images || formData.images.length === 0) &&
    //     (!formData.oldImages || formData.oldImages.length === 0)) {
    //     throw new CustomError(400, "At least one image is required");
    // }

    const updateFields: UpdateFields = {};

    if (formData.name !== undefined) {
      updateFields.name = formData.name;
    }
    if (formData.title !== undefined) {
      updateFields.title = formData.title;
    }

    if (formData.link !== undefined) {
      updateFields.link = formData.link;
    }

    if (formData.description !== undefined) {
      updateFields.description = formData.description;
    }

    if (formData.categories !== undefined) {
      updateFields.category = formData.categories;
    }

    if (formData.isEnabled !== undefined) {
      updateFields.isEnabled = formData.isEnabled;
    }

    if (formData.images && formData.images.length > 0) {
      // Upload each image to Cloudinary asynchronously
      const uploadPromises = formData.images.map(
        async (image: string, index: number) => {
          const uploadedImage = await uploadOnCloudinary(
            image,
            "project",
            640,
            285,
          );

          if (uploadedImage !== null) {
            return uploadedImage.url;
          } else {
            throw new CustomError(400, "image upload error");
          }
        },
      );

      const uploadedImages = await Promise.all(uploadPromises);

      const filteredImages = uploadedImages.filter((image) => image !== null);

      if (formData.oldImages !== undefined && formData.oldImages.length > 0) {
        updateFields.images = [...formData.oldImages, ...filteredImages];
      } else {
        updateFields.images = filteredImages;
      }
    }

    const updatedData = await ProjectModel.findOneAndUpdate(
      { _id },
      { $set: updateFields },
      { new: true },
    );

    if (!updatedData) {
      throw new CustomError(404, "Project data not found.");
    }

    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "project updated successfully"));
  },
);

export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, title, link, categories, images, description } = req.body;
    // const { name } = req.body as ICategory;
    // if (!(name || link || categories || images || description)) {
    //     throw new CustomError(400, "all field is required")
    // }
    //    ------------------------
    let imageList: string[] = [];
    if (images.length > 0) {
      const uploadPromises = images.map(async (imageUrl: string) => {
        try {
          const imageFile = await uploadOnCloudinary(
            imageUrl,
            "project",
            640,
            285,
          );
          if (imageFile) {
            return imageFile.url;
          } else {
            return null;
          }
        } catch (error: any) {
          console.error(
            `Error uploading image ${imageUrl} to Cloudinary:`,
            error,
          );
          throw new CustomError(400, "Error uploading image");
          return null;
        }
      });
      const uploadedImages = await Promise.all(uploadPromises);
      // Filter out any null values and add the URLs to imageList array
      imageList = uploadedImages.filter((url) => url !== null);
    }

    if (name) {
      try {
        const uniqueSlug = await generateUniqueSlug(name, ProjectModel);

        await ProjectModel.create({
          name,
          title,
          slug: uniqueSlug,
          link,
          category: categories,
          images: imageList,
          description,
        });
      } catch (error: any) {
        throw new CustomError(
          400,
          `Error create project with error: ${error.message}`,
        );
      }
    } else {
      throw new CustomError(400, "Name is required");
    }

    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "project create successfully"));
  },
);

export const getProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await ProjectModel.find({});
    if (!data) {
      throw new CustomError(400, "no project data found");
    }

    return res
      .status(200)
      .json(new ResponseHandler(200, { data }, "project return successfully"));
  },
);

export const getProjectByCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { category } = req.params;

    const query: any = { isEnabled: true };

    if (category && category.trim().toLowerCase() !== "all") {
      query.category = category.trim();
    }

    const projects = await ProjectModel.find(query);

    if (!projects || projects.length === 0) {
      return res
        .status(200)
        .json(new ResponseHandler(200, { data: [] }, "No project data found"));
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { data: projects },
          "Project(s) returned successfully",
        ),
      );
  },
);

export const getProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const data = await ProjectModel.findById({ _id });
    if (!data) {
      throw new CustomError(400, "no project data found");
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { data },
          "single project return successfully",
        ),
      );
  },
);

export const getProjectBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const data = await ProjectModel.findOne({ slug });
    if (!data) {
      throw new CustomError(400, "no project data found");
    }

    return res
      .status(200)
      .json(
        new ResponseHandler(
          200,
          { data },
          "single project return successfully",
        ),
      );
  },
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params._id;

    const projectData = await ProjectModel.findById({ _id });

    if (!projectData) {
      // Category not found, send custom error
      return new CustomError(404, "Project data not found");
    }

    await ProjectModel.deleteOne({ _id });
    return res
      .status(200)
      .json(new ResponseHandler(200, {}, "project deleted successfully"));
  },
);
