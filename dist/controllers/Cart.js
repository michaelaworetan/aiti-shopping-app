"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testcalculateTotalCost = exports.calculateTotalCost = exports.updateProductInCart = exports.removeFromCart = exports.addToCart = void 0;
const user_1 = require("../models/user");
const product_1 = require("../models/product");
// Add Products to Cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get the produt user wants to add
        const { email, productId, quantity } = req.body;
        //Get the user
        const user = yield user_1.User.findOne({ email });
        //Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get the productId using our Product model
        const product = yield product_1.Product.findById(productId);
        //Check if the productId exist in our product database
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        //Check if product exist in our cartProducts
        const cartItem = user.cartProducts.find((item) => item.productId.toString() === productId);
        // if the cartItem exists
        if (cartItem) {
            // Update the quantity
            cartItem.quantity += quantity;
        }
        else {
            // Push new product to cart
            user.cartProducts.push({ productId, quantity });
        }
        // save the user to the database
        const updateUser = yield user.save();
        return res.status(200).json({ message: "added to cart", updateUser });
    }
    catch (error) {
        console.error("Error adding products to carts: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addToCart = addToCart;
// Remove Products to Cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get the produt user wants to remove
        const { email, productId } = req.body;
        //Get the user
        const user = yield user_1.User.findOne({ email });
        //Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get the productId using our Product model
        const product = yield product_1.Product.findById(productId);
        //Check if the productId exist in our product database
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Filter out the product fro the cart array
        user.cartProducts = user.cartProducts.filter((item) => item.productId.toString() !== productId);
        // save the user to the database
        const filteredUser = yield user.save();
        return res.status(200).json({ message: "Removed from cart", filteredUser });
    }
    catch (error) {
        console.error("Error removing products from carts: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.removeFromCart = removeFromCart;
// Change Products quantity from Cart
const updateProductInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get the produt user wants to remove
        const { email, productId, quantity } = req.body;
        // Check if quantity is greater than 0
        if (quantity <= 0) {
            return res
                .status(404)
                .json({ message: "quantity must be greater than 0" });
        }
        //Get the user
        const user = yield user_1.User.findOne({ email });
        //Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get the productId using our Product model
        const product = yield product_1.Product.findById(productId);
        //Check if the productId exist in our product database
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Find an item using productId
        const cartItem = user.cartProducts.find((item) => item.productId.toString() === productId);
        if (!cartItem) {
            return res
                .status(404)
                .json({ message: "product does not exist in cart" });
        }
        // Modify cart quantity
        cartItem.quantity = quantity;
        // save the user to the database
        const modifiedUser = yield user.save();
        return res
            .status(200)
            .json({ message: "product updated in cart", modifiedUser });
    }
    catch (error) {
        console.error("Error updating Cart Item: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateProductInCart = updateProductInCart;
// Calculate total Products price in Cart
const calculateTotalCost = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user by email
    const user = yield user_1.User.findOne({ email });
    //Check if user exists
    if (!user) {
        throw new Error("User not found");
    }
    let totalCost = 0;
    // total cost using for..of loop
    for (const cartItem of user.cartProducts) {
        // for each cartItem of user.cartProducts
        // find the product by the id
        const product = yield product_1.Product.findById(cartItem.productId);
        // check if the product exists
        if (product) {
            const itemCost = parseFloat(product.price) * cartItem.quantity;
            // add the item cost into totaCost
            totalCost += itemCost;
        }
    }
    return totalCost;
});
exports.calculateTotalCost = calculateTotalCost;
// To test calculateTotalCost
const testcalculateTotalCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get email from the req.body
        const { email } = req.body;
        // Get the user by email
        const user = yield user_1.User.findOne({ email });
        //Check if user exists
        if (!user) {
            throw new Error("User not found");
        }
        let totalCost = 0;
        // total cost using for..of loop
        for (const cartItem of user.cartProducts) {
            // for each cartItem of user.cartProducts
            // find the product by the id
            const product = yield product_1.Product.findById(cartItem.productId);
            // check if the product exists
            if (product) {
                const itemCost = parseFloat(product.price) * cartItem.quantity;
                // add the item cost into totaCost
                totalCost += itemCost;
            }
        }
        return res.status(200).json(`Total cost is ${totalCost}`);
    }
    catch (error) {
        console.error("Error updating Cart Item: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.testcalculateTotalCost = testcalculateTotalCost;
