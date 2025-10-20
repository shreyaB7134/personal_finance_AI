import mongoose, { Document } from 'mongoose';
export interface IChallenge extends Document {
    userId: mongoose.Types.ObjectId;
    challenge: string;
    expiresAt: Date;
}
declare const _default: mongoose.Model<IChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IChallenge, {}, {}> & IChallenge & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Challenge.d.ts.map