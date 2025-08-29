import mongoose, { Document } from "mongoose";
export interface ITag extends Document {
    name: string;
    slug: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<ITag, {}, {}, {}, mongoose.Document<unknown, {}, ITag, {}, {}> & ITag & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TagModel.d.ts.map