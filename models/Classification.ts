import mongoose, { Schema, Document } from 'mongoose';

export interface IClassificationAttribute {
    code: string;
    name: {
        en: string;
        vi: string;
    };
    type: 'select' | 'number' | 'text' | 'boolean';
    options?: {
        en: string;
        vi: string;
    }[];
    unit?: string;
    isVariantDefining: boolean;
    required: boolean;
}

export interface IClassification extends Document {
    name: {
        en: string;
        vi: string;
    };
    attributes: IClassificationAttribute[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ClassificationAttributeSchema = new Schema({
    code: { type: String, required: true },
    name: {
        en: { type: String, required: true },
        vi: { type: String, required: true },
    },
    type: { type: String, enum: ['select', 'number', 'text', 'boolean'], required: true },
    options: [{
        en: { type: String },
        vi: { type: String },
    }],
    unit: { type: String },
    isVariantDefining: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
}, { _id: false });

const ClassificationSchema: Schema = new Schema(
    {
        name: {
            en: { type: String, required: true },
            vi: { type: String, required: true },
        },
        attributes: [ClassificationAttributeSchema],
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Classification || mongoose.model<IClassification>('Classification', ClassificationSchema);
