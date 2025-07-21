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
exports.createProduct = exports.getProducts = void 0;
const product_1 = require("../models/product");
// get product(s)
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_1.Product.find();
    return res.json(products);
});
exports.getProducts = getProducts;
// create product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price } = req.body;
    try {
        //  //Check if a product already exists with the provide
        //  const existingProduct = await Product.findOne({ id });
        //  if(existingProduct) {
        //     res.status(404).json({message: "Product already exists"})
        //     return
        //  }
        //create a new user instance from the provided data
        const newProduct = new product_1.Product({
            name,
            price,
        });
        //Save the new User to the database
        yield newProduct.save();
        //  Respond
        return res.status(201).json({ message: "new product", newProduct });
    }
    catch (error) {
        console.error(error); //log the error for degging
        return res.status(500).json({ message: "Server error" });
    }
});
exports.createProduct = createProduct;
