import { Document } from "mongoose";
export interface ISEO {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
}
export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
    author: string;
    category: String;
    tags: string[];
    featuredImage?: string;
    seo: ISEO;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: import("mongoose").Model<IPost, {}, {}, {}, Document<unknown, {}, IPost, {}, {}> & IPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Post.d.ts.map