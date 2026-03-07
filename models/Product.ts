import mongoose, { Schema, Document } from 'mongoose';
import Category from './Category';

export interface IProductVariant {
    _id?: string;
    sku: string;
    attributes: Map<string, any>;
    price: number;
    salePrice?: number;
    stock: number;
    image?: {
        publicId: string;
        url: string;
    }
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
    usageGuide?: {
        en: string;
        vi: string;
    };
    shippingReturns?: {
        en: string;
        vi: string;
    };
    categories: mongoose.Types.ObjectId[];
    basePrice: number;
    salePrice?: number;
    specifications?: Map<string, any>;
    images: IProductImage[];
    variants: IProductVariant[];
    status: 'draft' | 'published';
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
    attributes: { type: Map, of: Schema.Types.Mixed, default: {} },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    image: {
        publicId: { type: String },
        url: { type: String }
    }
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
        usageGuide: {
            en: { type: String },
            vi: { type: String },
        },
        shippingReturns: {
            en: { type: String },
            vi: { type: String },
        },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
        basePrice: { type: Number, required: true },
        salePrice: { type: Number },
        specifications: { type: Map, of: Schema.Types.Mixed, default: {} },
        images: [ProductImageSchema],
        variants: [ProductVariantSchema],
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
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

// In development, delete the model to force schema refresh on hot reload
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
