"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
const tokenExpiration = "1 day";
// Generate a token after user has signed in 
const generateToken = (payload) => {
    // return a signed token 
    const token = jsonwebtoken_1.default.sign(payload, tokenSecret, {
        expiresIn: tokenExpiration
    });
    return token;
};
exports.generateToken = generateToken;
const auth = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer", "");
    if (!token) {
        res.status(401).json({ message: "Authorization token is missing" });
        return; // Stop further execution
    }
    jsonwebtoken_1.default.verify(token, tokenSecret);
    next(); // Proceed if the token is valid
};
exports.auth = auth;
