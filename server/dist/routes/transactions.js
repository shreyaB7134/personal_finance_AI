"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get transactions with filters
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const { startDate, endDate, category, accountId, limit = '50', offset = '0', search, } = req.query;
        const query = { userId: req.userId };
        // Date filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        // Category filter
        if (category) {
            query.category = category;
        }
        // Account filter
        if (accountId) {
            query.accountId = accountId;
        }
        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { merchantName: { $regex: search, $options: 'i' } },
            ];
        }
        const transactions = await Transaction_1.default.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset))
            .populate('accountId', 'name mask type');
        const total = await Transaction_1.default.countDocuments(query);
        res.json({
            transactions,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
// Get transaction by ID
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findOne({
            _id: req.params.id,
            userId: req.userId,
        }).populate('accountId', 'name mask type');
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ transaction });
    }
    catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});
// Update transaction (tags, recurring flag)
router.patch('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { tags, isRecurring, aiSuggestedCategory } = req.body;
        const update = {};
        if (tags !== undefined)
            update.tags = tags;
        if (isRecurring !== undefined)
            update.isRecurring = isRecurring;
        if (aiSuggestedCategory !== undefined)
            update.aiSuggestedCategory = aiSuggestedCategory;
        const transaction = await Transaction_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, update, { new: true });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ transaction });
    }
    catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});
// Get latest transactions
router.get('/latest/summary', auth_1.authenticate, async (req, res) => {
    try {
        const transactions = await Transaction_1.default.find({ userId: req.userId })
            .sort({ date: -1 })
            .limit(3)
            .populate('accountId', 'name mask');
        res.json({ transactions });
    }
    catch (error) {
        console.error('Get latest transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch latest transactions' });
    }
});
// Detect anomalies
router.post('/detect-anomalies', auth_1.authenticate, async (req, res) => {
    try {
        const transactions = await Transaction_1.default.find({ userId: req.userId });
        // Group by category and calculate averages
        const categoryStats = {};
        transactions.forEach((t) => {
            const cat = t.category[0] || 'Other';
            if (!categoryStats[cat]) {
                categoryStats[cat] = { total: 0, count: 0, avg: 0 };
            }
            categoryStats[cat].total += Math.abs(t.amount);
            categoryStats[cat].count += 1;
        });
        // Calculate averages
        Object.keys(categoryStats).forEach((cat) => {
            categoryStats[cat].avg = categoryStats[cat].total / categoryStats[cat].count;
        });
        // Flag anomalies (>3x average)
        let anomalyCount = 0;
        for (const transaction of transactions) {
            const cat = transaction.category[0] || 'Other';
            const avg = categoryStats[cat]?.avg || 0;
            const isAnomaly = Math.abs(transaction.amount) > avg * 3;
            if (transaction.isAnomaly !== isAnomaly) {
                transaction.isAnomaly = isAnomaly;
                await transaction.save();
                if (isAnomaly)
                    anomalyCount++;
            }
        }
        res.json({
            message: 'Anomaly detection completed',
            anomaliesDetected: anomalyCount,
        });
    }
    catch (error) {
        console.error('Detect anomalies error:', error);
        res.status(500).json({ error: 'Failed to detect anomalies' });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map