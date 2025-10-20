import mongoose, { Document } from 'mongoose';
export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    category: 'savings' | 'purchase' | 'debt' | 'investment' | 'emergency' | 'other';
    deadline?: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    currency: string;
    monthlyContribution?: number;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}
declare const _default: mongoose.Model<IGoal, {}, {}, {}, mongoose.Document<unknown, {}, IGoal, {}, {}> & IGoal & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Goal.d.ts.map