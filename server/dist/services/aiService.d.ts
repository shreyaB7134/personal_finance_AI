import mongoose from 'mongoose';
interface FinancialContext {
    totalBalance: number;
    accounts: any[];
    recentTransactions: any[];
    monthlyIncome: number;
    monthlyExpenses: number;
    topCategories: {
        category: string;
        amount: number;
    }[];
    savingsRate: number;
    currency: string;
}
export declare class AIService {
    private model;
    constructor();
    /**
     * Get comprehensive financial context for the user
     */
    getFinancialContext(userId: mongoose.Types.ObjectId | string): Promise<FinancialContext>;
    /**
     * Build context string for AI
     */
    buildContextString(context: FinancialContext): string;
    /**
     * Generate AI response with financial context
     */
    generatePersonalizedResponse(userId: mongoose.Types.ObjectId | string, userMessage: string, conversationHistory?: {
        role: string;
        content: string;
    }[]): Promise<string>;
    /**
     * Generate generic response (when data sharing is off)
     */
    generateGenericResponse(userMessage: string): Promise<string>;
    /**
     * Generate suggested questions based on user's financial situation
     */
    generateSuggestedQuestions(userId: mongoose.Types.ObjectId | string): Promise<string[]>;
}
declare const _default: AIService;
export default _default;
//# sourceMappingURL=aiService.d.ts.map