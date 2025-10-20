import mongoose, { Document } from 'mongoose';
export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    accountId: mongoose.Types.ObjectId;
    plaidTransactionId: string;
    amount: number;
    date: Date;
    name: string;
    merchantName?: string;
    category: string[];
    categoryId?: string;
    pending: boolean;
    isoCurrencyCode: string;
    paymentChannel: string;
    isAnomaly: boolean;
    aiSuggestedCategory?: string;
    isRecurring: boolean;
    tags: string[];
}
declare const _default: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, {}> & ITransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Transaction.d.ts.map