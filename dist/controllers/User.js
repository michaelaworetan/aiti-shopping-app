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
exports.addProductToCart = exports.signIn = exports.createUser = exports.getUsers = void 0;
const user_1 = require("../models/user");
const auth_1 = require("../middleware/auth");
// get Users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find();
    res.json(users);
});
exports.getUsers = getUsers;
// create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        //Check if a user already exists with the provide email
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            res.status(404).json({ message: "User already exists" });
            return;
        }
        //create a new user instance from the provided data
        const newUser = new user_1.User({
            name,
            email,
            password
        });
        //Save the new User to the database
        yield newUser.save();
        //  Respond 
        res.status(201).json({ newUser });
    }
    catch (error) {
        console.error(error); //log the error for degging
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createUser = createUser;
// sign-in users
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //  Check if user exist in the database
        const foundUser = yield user_1.User.findOne({ email });
        if (!foundUser) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        if (password !== foundUser.password) {
            res.status(400).json({ message: "email or password invalid" });
            return;
        }
        // using the foundUser as our payload
        const token = (0, auth_1.generateToken)({ foundUser });
        res.status(200).json({ message: "User login succesful", token });
        return;
    }
    catch (error) {
        console.error(error); //log the error for degging
        res.status(500).json({ message: 'Server error' });
    }
});
exports.signIn = signIn;
// add products to cart
const addProductToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, productId } = req.body;
    try {
        //  Check if user exist in the database
        const user = yield user_1.User.findByIdAndUpdate(id, { name, products: productId });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        res.status(200).json({ message: "products added to cart successfully", user });
    }
    catch (error) {
        console.error(error); //log the error for degging
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addProductToCart = addProductToCart;
