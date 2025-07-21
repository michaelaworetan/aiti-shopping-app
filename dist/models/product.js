"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    id: { type: String },
    name: { type: String, required: true },
    price: { type: String, required: true },
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);
