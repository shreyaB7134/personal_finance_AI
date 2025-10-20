import mongoose, { Document } from 'mongoose';
export interface IMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
export interface IChat extends Document {
    userId: mongoose.Types.ObjectId;
    messages: IMessage[];
    dataSharing: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, {}> & IChat & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Chat.d.ts.map