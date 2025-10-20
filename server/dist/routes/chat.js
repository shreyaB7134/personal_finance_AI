"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Chat_1 = __importDefault(require("../models/Chat"));
const aiService_1 = __importDefault(require("../services/aiService"));
const router = express_1.default.Router();
// Get or create chat session
router.get('/session', auth_1.authenticate, async (req, res) => {
    try {
        let chat = await Chat_1.default.findOne({ userId: req.userId }).sort({ createdAt: -1 });
        if (!chat) {
            // Create new chat with data sharing OFF by default (privacy-first)
            chat = await Chat_1.default.create({
                userId: req.userId,
                messages: [],
                dataSharing: false, // Default to OFF for privacy
            });
        }
        res.json({
            chatId: chat._id,
            messages: chat.messages,
            dataSharing: chat.dataSharing,
        });
    }
    catch (error) {
        console.error('Get chat session error:', error);
        res.status(500).json({ error: 'Failed to get chat session' });
    }
});
// Send message and get AI response
router.post('/message', auth_1.authenticate, async (req, res) => {
    try {
        const { message, chatId, dataSharing } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Get or create chat
        let chat = chatId ? await Chat_1.default.findById(chatId) : null;
        if (!chat || chat.userId.toString() !== req.userId?.toString()) {
            chat = await Chat_1.default.create({
                userId: req.userId,
                messages: [],
                dataSharing: dataSharing !== undefined ? dataSharing : true,
            });
        }
        // IMPORTANT: Update data sharing preference BEFORE generating response
        if (dataSharing !== undefined) {
            chat.dataSharing = dataSharing;
        }
        // Use the CURRENT data sharing state for this message
        const usePersonalizedResponse = chat.dataSharing;
        // Add user message
        chat.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date(),
        });
        // Generate AI response based on CURRENT data sharing state
        let aiResponse;
        console.log(`[Chat] Data Sharing: ${usePersonalizedResponse ? 'ENABLED' : 'DISABLED'} for user ${req.userId}`);
        if (usePersonalizedResponse) {
            // Personalized response with financial data
            console.log('[Chat] Generating PERSONALIZED response with financial data');
            aiResponse = await aiService_1.default.generatePersonalizedResponse(req.userId, message, chat.messages.slice(-10).map((m) => ({ role: m.role, content: m.content })));
        }
        else {
            // Generic response without financial data
            console.log('[Chat] Generating GENERIC response without financial data');
            aiResponse = await aiService_1.default.generateGenericResponse(message);
        }
        // Add AI response
        chat.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
        });
        await chat.save();
        res.json({
            chatId: chat._id,
            message: {
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
            },
        });
    }
    catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});
// Get chat history
router.get('/history', auth_1.authenticate, async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const chats = await Chat_1.default.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(Number(limit));
        res.json({ chats });
    }
    catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
});
// Clear chat history
router.delete('/clear', auth_1.authenticate, async (req, res) => {
    try {
        const { chatId } = req.body;
        if (chatId) {
            // Clear specific chat
            const chat = await Chat_1.default.findById(chatId);
            if (chat && chat.userId.toString() === req.userId?.toString()) {
                chat.messages = [];
                await chat.save();
            }
        }
        else {
            // Clear all chats
            await Chat_1.default.deleteMany({ userId: req.userId });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Clear chat error:', error);
        res.status(500).json({ error: 'Failed to clear chat' });
    }
});
// Get suggested questions
router.get('/suggestions', auth_1.authenticate, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const suggestions = await aiService_1.default.generateSuggestedQuestions(req.userId);
        res.json({ suggestions });
    }
    catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({
            suggestions: [
                'What is my total spending this month?',
                'How can I improve my savings?',
                'Where should I invest my money?',
                'Can I afford a major purchase?',
            ]
        });
    }
});
// Update data sharing preference
router.put('/data-sharing', auth_1.authenticate, async (req, res) => {
    try {
        const { enabled, chatId } = req.body;
        if (enabled === undefined) {
            return res.status(400).json({ error: 'enabled field is required' });
        }
        let chat = chatId ? await Chat_1.default.findById(chatId) : null;
        if (!chat || chat.userId.toString() !== req.userId?.toString()) {
            chat = await Chat_1.default.findOne({ userId: req.userId }).sort({ createdAt: -1 });
        }
        if (chat) {
            chat.dataSharing = enabled;
            await chat.save();
        }
        res.json({ success: true, dataSharing: enabled });
    }
    catch (error) {
        console.error('Update data sharing error:', error);
        res.status(500).json({ error: 'Failed to update data sharing' });
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map