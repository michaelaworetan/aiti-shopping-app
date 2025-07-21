"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// cartProduct Schema
const cartProductSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "product" },
    quantity: { type: Number, required: true },
});
// userSChema including a cartProducts Property which is based on cartProductSchema
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartProducts: { type: [cartProductSchema], default: [] },
});
// User model using on user interface based on userSchema
exports.User = (0, mongoose_1.model)("User", userSchema);
