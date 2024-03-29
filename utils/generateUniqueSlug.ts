import slugify from 'slugify';
import { Model } from 'mongoose';
import { IProject } from '../models/ProjectModel';


// Function to generate a unique slug for a given name and find uniqueness against existing slugs
const generateUniqueSlug = async (name: string, ProvidedModel: Model<IProject>) => {
    const originalSlug = slugify(name, {
        replacement: '-',
        lower: true,
        strict: false,
        locale: 'vi', // Set your desired locale
    });

    try {
        // Construct regex to find existing slugs
        const slugRegex = new RegExp(`^${originalSlug}(-[0-9]+)?$`);

        // Find documents with similar slugs
        const existingProjects = await ProvidedModel.find({ slug: { $regex: slugRegex } });

        if (existingProjects.length > 0) {
            // If similar slugs exist, add a numerical suffix
            return `${originalSlug}-${existingProjects.length + 1}`;
        } else {
            // Otherwise, use the original slug
            return originalSlug;
        }
    } catch (error) {
        // Handle errors, you may choose to throw or return an error message
        throw new Error('Error generating unique slug');
    }
};

export default generateUniqueSlug;