import mongoose, { Document } from 'mongoose';
export interface IAccount extends Document {
    userId: mongoose.Types.ObjectId;
    plaidAccountId: string;
    name: string;
    officialName?: string;
    type: string;
    subtype: string;
    mask?: string;
    currentBalance: number;
    availableBalance?: number;
    currency: string;
    lastSynced: Date;
}
declare const _default: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount, {}, {}> & IAccount & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Account.d.ts.map