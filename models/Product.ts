import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
    _id?: string;
    sku: string;
    size?: string;
    color?: string;
    price: number;
    salePrice?: number;
    stock: number;
}

export interface IProductImage {
    publicId: string;
    url: string;
    isMain: boolean;
}

export interface IProduct extends Document {
    name: {
        en: string;
        vi: string;
    };
    slug: string;
    shortDescription: {
        en: string;
        vi: string;
    };
    description: {
        en: string;
        vi: string;
    };
    categories: mongoose.Types.ObjectId[];
    basePrice: number;
    salePrice?: number;
    images: IProductImage[];
    variants: IProductVariant[];
    isActive: boolean;
    isFeatured: boolean;
    seoTitle?: {
        en: string;
        vi: string;
    };
    seoDescription?: {
        en: string;
        vi: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ProductVariantSchema = new Schema({
    sku: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
});

const ProductImageSchema = new Schema({
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    isMain: { type: Boolean, default: false },
});

const ProductSchema: Schema = new Schema(
    {
        name: {
            en: { type: String, required: true },
            vi: { type: String, required: true },
        },
        slug: { type: String, required: true, unique: true },
        shortDescription: {
            en: { type: String },
            vi: { type: String },
        },
        description: {
            en: { type: String },
            vi: { type: String },
        },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
        basePrice: { type: Number, required: true },
        salePrice: { type: Number },
        images: [ProductImageSchema],
        variants: [ProductVariantSchema],
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        seoTitle: {
            en: { type: String },
            vi: { type: String },
        },
        seoDescription: {
            en: { type: String },
            vi: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
