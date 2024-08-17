import  { Schema, Document, model, models, Model } from 'mongoose';


export interface IContact extends Document {
    name: string;
    email: string;
    details: string;
}

const contactSchema: Schema<IContact> = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    details: {
        type: String,
    }

}, { timestamps: true });



const ContactModel: Model<IContact> = (models.Contact || model<IContact>('Contact', contactSchema)) as Model<IContact>;

export default ContactModel;