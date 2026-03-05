import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: {
        en: string;
        vi: string;
    };
    slug: string;
    description?: {
        en: string;
        vi: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        name: {
            en: { type: String, required: true },
            vi: { type: String, required: true },
        },
        slug: { type: String, required: true, unique: true },
        description: {
            en: { type: String },
            vi: { type: String },
        },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
