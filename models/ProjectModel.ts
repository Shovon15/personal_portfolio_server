import mongoose, { Schema, Document, model, models, Model } from 'mongoose';
// import slugify from 'slugify';

export interface IProject extends Document {
    name: string;
    title: string;
    slug: string;
    link: string;
    description: string;
    images: string[];
    category: string[];
    isEnabled: boolean;
}

const projectSchema: Schema<IProject> = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    title: {
        type: String,
        required: [true, 'title is required']
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
        unique: true,
    },
    link: {
        type: String,
        required: [true, 'link is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    images: {
        type: [String],
        required: [true, 'at least one image is required']
    },
    category: {
        type: [String],
        required: [true, 'select at least one category']
    },
    isEnabled: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });


const ProjectModel: Model<IProject> = (models.Project || mongoose.model<IProject>('Project', projectSchema)) as Model<IProject>;

export default ProjectModel;
