import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
    title: { en: string; vi: string };
    slug: string;
    content: { en: string; vi: string };
    excerpt: { en: string; vi: string };
    featuredImageUrl?: string;
    featuredImagePublicId?: string;
    status: 'Draft' | 'Published';
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
    {
        title: { en: { type: String, required: true }, vi: { type: String, required: true } },
        slug: { type: String, required: true, unique: true },
        content: { en: { type: String }, vi: { type: String } },
        excerpt: { en: { type: String }, vi: { type: String } },
        featuredImageUrl: { type: String },
        featuredImagePublicId: { type: String },
        status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
