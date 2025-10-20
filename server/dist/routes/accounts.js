"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plaid_1 = require("plaid");
const Account_1 = __importDefault(require("../models/Account"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const encryption_1 = require("../utils/encryption");
const router = express_1.default.Router();
const configuration = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments[process.env.PLAID_ENV] || plaid_1.PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});
const plaidClient = new plaid_1.PlaidApi(configuration);
// Get all accounts grouped by institution
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const accounts = await Account_1.default.find({ userId: req.userId });
        // Group accounts by institution
        const institutions = {};
        accounts.forEach(account => {
            // Use officialName as institution name, fallback to name if not available
            // For better institution grouping, we'll use the first word of the name if officialName is not available
            const institutionName = account.officialName ||
                (account.name && account.name.split(' ')[0]) ||
                'Unknown Institution';
            if (!institutions[institutionName]) {
                institutions[institutionName] = {
                    institutionName: institutionName,
                    accounts: [],
                    totalBalance: 0
                };
            }
            institutions[institutionName].accounts.push({
                id: account._id,
                plaidAccountId: account.plaidAccountId,
                name: account.name,
                type: account.type,
                subtype: account.subtype,
                mask: account.mask,
                currentBalance: account.currentBalance,
                availableBalance: account.availableBalance,
                currency: account.currency
            });
            institutions[institutionName].totalBalance += account.currentBalance || 0;
        });
        // Convert to array format
        const institutionList = Object.values(institutions);
        res.json({ institutions: institutionList });
    }
    catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});
// Get real-time balances
router.get('/balances', auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select('+plaidAccessToken');
        if (!user || !user.plaidAccessToken) {
            return res.status(400).json({ error: 'No bank account linked' });
        }
        const accessToken = (0, encryption_1.decrypt)(user.plaidAccessToken);
        // Fetch real-time balances from Plaid
        const balancesResponse = await plaidClient.accountsBalanceGet({
            access_token: accessToken,
        });
        const accounts = balancesResponse.data.accounts;
        // Update stored balances
        for (const account of accounts) {
            await Account_1.default.findOneAndUpdate({ userId: req.userId, plaidAccountId: account.account_id }, {
                currentBalance: account.balances.current || 0,
                availableBalance: account.balances.available,
                lastSynced: new Date(),
            });
        }
        res.json({
            accounts: accounts.map((acc) => ({
                id: acc.account_id,
                name: acc.name,
                mask: acc.mask,
                type: acc.type,
                subtype: acc.subtype,
                currentBalance: acc.balances.current,
                availableBalance: acc.balances.available,
                currency: acc.balances.iso_currency_code || 'USD',
            })),
        });
    }
    catch (error) {
        console.error('Get balances error:', error);
        res.status(500).json({ error: 'Failed to fetch balances' });
    }
});
exports.default = router;
//# sourceMappingURL=accounts.js.map