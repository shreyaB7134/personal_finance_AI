import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    name: string;
    phone?: string;
    dateOfBirth?: Date;
    monthlyIncome?: number;
    pinHash: string;
    webAuthnCredentials: Array<{
        credentialID: string;
        credentialPublicKey: string;
        counter: number;
        transports?: string[];
    }>;
    plaidAccessToken?: string;
    plaidItemId?: string;
    hasBankConnected: boolean;
    onboardingComplete: boolean;
    devicePIN?: string;
    consentTimestamp: Date;
    privacySettings: {
        voiceConsent: boolean;
        dataSharing: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map