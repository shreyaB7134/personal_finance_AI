"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@simplewebauthn/server");
const User_1 = __importDefault(require("../models/User"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const rpName = process.env.RP_NAME || 'Financial Agent';
const rpID = process.env.RP_ID || 'localhost';
const origin = process.env.ORIGIN || 'http://localhost:3000';
// Generate registration options
router.post('/register/options', auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const options = await (0, server_1.generateRegistrationOptions)({
            rpName,
            rpID,
            userID: user._id.toString(),
            userName: user.email,
            userDisplayName: user.name,
            attestationType: 'none',
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                requireResidentKey: false,
                userVerification: 'required',
            },
            excludeCredentials: user.webAuthnCredentials.map((cred) => ({
                id: Buffer.from(cred.credentialID, 'base64'),
                type: 'public-key',
                transports: cred.transports,
            })),
        });
        // Store challenge
        await Challenge_1.default.create({
            userId: user._id,
            challenge: options.challenge,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
        res.json(options);
    }
    catch (error) {
        console.error('WebAuthn registration options error:', error);
        res.status(500).json({ error: 'Failed to generate registration options' });
    }
});
// Verify registration
router.post('/register/verify', auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const body = req.body.credential;
        // Get stored challenge
        const challengeDoc = await Challenge_1.default.findOne({
            userId: user._id,
        }).sort({ expiresAt: -1 });
        if (!challengeDoc) {
            return res.status(400).json({ error: 'Challenge not found' });
        }
        // Check if body has the required fields
        if (!body || !body.response || !body.rawId) {
            return res.status(400).json({ error: 'Invalid credential data' });
        }
        const verification = await (0, server_1.verifyRegistrationResponse)({
            response: body,
            expectedChallenge: challengeDoc.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
        if (!verification.verified || !verification.registrationInfo) {
            return res.status(400).json({ error: 'Verification failed' });
        }
        const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;
        // Store credential
        user.webAuthnCredentials.push({
            credentialID: Buffer.from(credentialID).toString('base64'),
            credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
            counter,
            transports: body.response.transports,
        });
        await user.save();
        // Delete challenge
        await Challenge_1.default.deleteOne({ _id: challengeDoc._id });
        res.json({
            verified: true,
            message: 'WebAuthn credential registered successfully',
        });
    }
    catch (error) {
        console.error('WebAuthn registration verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});
// Generate authentication options
router.post('/authenticate/options', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || user.webAuthnCredentials.length === 0) {
            return res.status(404).json({ error: 'User not found or no credentials' });
        }
        const options = await (0, server_1.generateAuthenticationOptions)({
            rpID,
            allowCredentials: user.webAuthnCredentials.map((cred) => ({
                id: Buffer.from(cred.credentialID, 'base64'),
                type: 'public-key',
                transports: cred.transports,
            })),
            userVerification: 'required',
        });
        // Store challenge
        await Challenge_1.default.create({
            userId: user._id,
            challenge: options.challenge,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.json(options);
    }
    catch (error) {
        console.error('WebAuthn authentication options error:', error);
        res.status(500).json({ error: 'Failed to generate authentication options' });
    }
});
// Verify authentication
router.post('/authenticate/verify', async (req, res) => {
    try {
        const { email, credential } = req.body;
        const body = credential;
        if (!email || !body) {
            return res.status(400).json({ error: 'Email and credential are required' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Get stored challenge
        const challengeDoc = await Challenge_1.default.findOne({
            userId: user._id,
        }).sort({ expiresAt: -1 });
        if (!challengeDoc) {
            return res.status(400).json({ error: 'Challenge not found' });
        }
        // Find credential
        const userCredential = user.webAuthnCredentials.find((cred) => cred.credentialID === Buffer.from(body.rawId, 'base64').toString('base64'));
        if (!userCredential) {
            return res.status(400).json({ error: 'Credential not found' });
        }
        const verification = await (0, server_1.verifyAuthenticationResponse)({
            response: body,
            expectedChallenge: challengeDoc.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
                credentialID: Buffer.from(userCredential.credentialID, 'base64'),
                credentialPublicKey: Buffer.from(userCredential.credentialPublicKey, 'base64'),
                counter: userCredential.counter,
            },
            requireUserVerification: true,
        });
        if (!verification.verified) {
            return res.status(400).json({ error: 'Verification failed' });
        }
        // Update counter
        userCredential.counter = verification.authenticationInfo.newCounter;
        await user.save();
        // Delete challenge
        await Challenge_1.default.deleteOne({ _id: challengeDoc._id });
        // Generate token
        const token = (0, auth_1.generateToken)(user._id.toString());
        // Return user data including onboarding status
        res.json({
            verified: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                hasWebAuthn: user.webAuthnCredentials.length > 0,
                onboardingComplete: user.onboardingComplete,
                hasBankConnected: user.hasBankConnected,
            },
            onboardingStep: user.onboardingComplete ? null : 'bank_connection',
        });
    }
    catch (error) {
        console.error('WebAuthn authentication verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});
exports.default = router;
//# sourceMappingURL=webauthn.js.map