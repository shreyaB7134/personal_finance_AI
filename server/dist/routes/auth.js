"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Register new user
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
    (0, express_validator_1.body)('name').trim().notEmpty(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const user = new User_1.default({
            email,
            passwordHash,
            name,
            consentTimestamp: new Date(),
        });
        await user.save();
        const token = (0, auth_1.generateToken)(user._id.toString());
        const refreshToken = (0, auth_1.generateRefreshToken)(user._id.toString());
        res.status(201).json({
            message: 'User registered successfully',
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
// Login
router.post('/login', [(0, express_validator_1.body)('email').isEmail().normalizeEmail(), (0, express_validator_1.body)('password').notEmpty()], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        if (!user.passwordHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = (0, auth_1.generateToken)(user._id.toString());
        const refreshToken = (0, auth_1.generateRefreshToken)(user._id.toString());
        res.json({
            message: 'Login successful',
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                hasWebAuthn: user.webAuthnCredentials.length > 0,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// PhonePe-style registration with PIN
router.post('/register-with-pin', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('name').trim().notEmpty(),
    (0, express_validator_1.body)('pin').isLength({ min: 4, max: 6 }).isNumeric(),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any'),
    (0, express_validator_1.body)('dateOfBirth').optional().isISO8601(),
    (0, express_validator_1.body)('monthlyIncome').optional().isNumeric(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, name, pin, phone, dateOfBirth, monthlyIncome } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash PIN
        const pinHash = await bcryptjs_1.default.hash(pin, 12);
        // Create user
        const user = new User_1.default({
            email,
            name,
            phone,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            monthlyIncome,
            pinHash,
            hasBankConnected: false,
            onboardingComplete: false,
            consentTimestamp: new Date(),
        });
        await user.save();
        const token = (0, auth_1.generateToken)(user._id.toString());
        const refreshToken = (0, auth_1.generateRefreshToken)(user._id.toString());
        res.status(201).json({
            message: 'User registered successfully',
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                hasBankConnected: user.hasBankConnected,
                onboardingComplete: user.onboardingComplete,
            },
            onboardingStep: 'bank_connection',
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
// Verify PIN for login
router.post('/verify-pin', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('pin').isLength({ min: 4, max: 6 }).isNumeric(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, pin } = req.body;
        // Find user and include pinHash
        const user = await User_1.default.findOne({ email }).select('+pinHash');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify PIN
        const isValidPIN = await bcryptjs_1.default.compare(pin, user.pinHash);
        if (!isValidPIN) {
            return res.status(401).json({ error: 'Invalid PIN' });
        }
        const token = (0, auth_1.generateToken)(user._id.toString());
        const refreshToken = (0, auth_1.generateRefreshToken)(user._id.toString());
        res.json({
            verified: true,
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                hasBankConnected: user.hasBankConnected,
                onboardingComplete: user.onboardingComplete,
                hasWebAuthn: user.webAuthnCredentials.length > 0,
            },
        });
    }
    catch (error) {
        console.error('PIN verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});
// Get onboarding status
router.get('/onboarding-status', auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        let nextStep = 'complete';
        if (!user.hasBankConnected) {
            nextStep = 'bank_connection';
        }
        res.json({
            onboardingComplete: user.onboardingComplete,
            hasBankConnected: user.hasBankConnected,
            nextStep,
        });
    }
    catch (error) {
        console.error('Onboarding status error:', error);
        res.status(500).json({ error: 'Failed to get onboarding status' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map