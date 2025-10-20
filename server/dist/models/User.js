"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: false, // Optional for PhonePe-style flow
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    monthlyIncome: {
        type: Number,
        required: false,
    },
    pinHash: {
        type: String,
        required: false, // Make pinHash optional since not all users will have PIN-based auth
        select: false, // Don't return by default
    },
    webAuthnCredentials: [
        {
            credentialID: { type: String, required: true },
            credentialPublicKey: { type: String, required: true },
            counter: { type: Number, required: true },
            transports: [String],
        },
    ],
    plaidAccessToken: {
        type: String,
        select: false, // Don't return by default
    },
    plaidItemId: {
        type: String,
    },
    hasBankConnected: {
        type: Boolean,
        default: false,
    },
    onboardingComplete: {
        type: Boolean,
        default: false,
    },
    devicePIN: {
        type: String,
        select: false,
    },
    consentTimestamp: {
        type: Date,
        default: Date.now,
    },
    privacySettings: {
        voiceConsent: {
            type: Boolean,
            default: false,
        },
        dataSharing: {
            type: Boolean,
            default: false,
        },
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map