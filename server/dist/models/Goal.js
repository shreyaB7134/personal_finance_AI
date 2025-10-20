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
const goalSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    targetAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    category: {
        type: String,
        enum: ['savings', 'purchase', 'debt', 'investment', 'emergency', 'other'],
        default: 'savings',
    },
    deadline: {
        type: Date,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'cancelled'],
        default: 'active',
    },
    currency: {
        type: String,
        default: 'USD',
    },
    monthlyContribution: {
        type: Number,
        min: 0,
    },
    completedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Index for efficient queries
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, deadline: 1 });
// Virtual for progress percentage
goalSchema.virtual('progress').get(function () {
    if (this.targetAmount === 0)
        return 0;
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});
// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function () {
    return Math.max(this.targetAmount - this.currentAmount, 0);
});
// Method to calculate estimated completion date
goalSchema.methods.estimatedCompletionDate = function () {
    if (!this.monthlyContribution || this.monthlyContribution === 0) {
        return null;
    }
    const remaining = this.targetAmount - this.currentAmount;
    if (remaining <= 0)
        return new Date();
    const monthsNeeded = Math.ceil(remaining / this.monthlyContribution);
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsNeeded);
    return completionDate;
};
exports.default = mongoose_1.default.model('Goal', goalSchema);
//# sourceMappingURL=Goal.js.map