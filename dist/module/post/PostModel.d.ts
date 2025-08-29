import { Document, Types } from "mongoose";
export interface ISEO {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
}
export interface IPost extends Document {
    title: string;
    subTitle: string;
    slug: string;
    content: string;
    author: Types.ObjectId;
    category: Types.ObjectId;
    tags: Types.ObjectId[];
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
//# sourceMappingURL=PostModel.d.ts.map