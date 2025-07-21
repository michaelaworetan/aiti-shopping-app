"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = require("../controllers/Product");
const router = (0, express_1.Router)();
//  Get Produxt Routes
router.get("/", Product_1.getProducts);
// createProducts Routes
router.post("/", Product_1.createProduct);
exports.default = router;
