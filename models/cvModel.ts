import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface ICv extends Document {
  link: string;
  isEnabled: boolean;
}

const cvSchema: Schema<ICv> = new Schema(
  {
    link: {
      type: String,
      required: [true, "link is required"],
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const CvModel: Model<ICv> = (models.Cv ||
  mongoose.model<ICv>("Cv", cvSchema)) as Model<ICv>;

export default CvModel;
