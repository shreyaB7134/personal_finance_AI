"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.generateAESKey = generateAESKey;
exports.generateJWTSecret = generateJWTSecret;
const crypto_js_1 = __importDefault(require("crypto-js"));
const AES_KEY = process.env.AES_256_KEY || '';
if (!AES_KEY) {
    throw new Error('AES_256_KEY must be set in environment variables');
}
/**
 * Encrypt sensitive data using AES-256
 */
function encrypt(data) {
    try {
        const encrypted = crypto_js_1.default.AES.encrypt(data, AES_KEY).toString();
        return encrypted;
    }
    catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}
/**
 * Decrypt sensitive data using AES-256
 */
function decrypt(encryptedData) {
    try {
        const decrypted = crypto_js_1.default.AES.decrypt(encryptedData, AES_KEY);
        return decrypted.toString(crypto_js_1.default.enc.Utf8);
    }
    catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}
/**
 * Generate a random AES-256 key
 */
function generateAESKey() {
    return crypto_js_1.default.lib.WordArray.random(32).toString();
}
/**
 * Generate a random JWT secret
 */
function generateJWTSecret() {
    return crypto_js_1.default.lib.WordArray.random(64).toString();
}
//# sourceMappingURL=encryption.js.map