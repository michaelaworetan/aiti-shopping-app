"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Cart_1 = require("../controllers/Cart");
const router = (0, express_1.Router)();
//  addCart Routes
router.post("/addToCart", Cart_1.addToCart);
//  remove Products from cart Routes
router.post("/removeFromCart", Cart_1.removeFromCart);
// update product in cart Routes
router.post("/updateProductInCart", Cart_1.updateProductInCart);
// Total cost  Routes
router.post("/testcalculateTotalCost", Cart_1.testcalculateTotalCost);
exports.default = router;
