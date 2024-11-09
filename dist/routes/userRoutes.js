"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../controllers/User");
const router = (0, express_1.Router)();
//  Get Users Routes
router.get("/", User_1.getUsers);
// Create Users Routes
router.post("/", User_1.createUser);
// Sign-in users ROutes
router.post("/signin", User_1.signIn);
// add products to cart Routes
router.post("/addToCart/:id", User_1.addProductToCart);
exports.default = router;
