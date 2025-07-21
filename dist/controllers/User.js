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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.deleteUser = exports.UpdateUser = exports.createUser = exports.getUsers = void 0;
const user_1 = require("../models/user");
const auth_1 = require("../middleware/auth");
const redisClient_1 = __importDefault(require("../utils/redisClient"));
// get Users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await redisClient.del("ip");
        //Check if users are available in Redis cache
        // const cachedUsers = await redisClient.get("users")
        // if (cachedUsers) {
        //    //Check if users were found then log to the console
        //    console.log("Serving users from the cache");
        //    //return cached users in JDON format
        //    res.json(JSON.parse(cachedUsers))
        //    return;
        // }
        //if there are not in the cache, fetch from db
        const users = yield user_1.User.find();
        //store the fetcheUsers in Redis cache
        // await redisClient.set("users", JSON.stringify(users))
        // //from the db
        // console.log("Serving users from the DB");
        // Return the users back to the client
        return res.json(users);
    }
    catch (error) {
        console.error("Error fetching users: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUsers = getUsers;
// create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userCacheKey = "newUser";
        //Check if a user already exists with the provide email
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: "User already exists" });
        }
        //Invalidate Users's cache(Manuel Override)
        yield redisClient_1.default.del(userCacheKey);
        //create a new user instance from the provided data
        const newUser = new user_1.User({
            name,
            email,
            password,
        });
        //Save the new User to the database
        const savedUser = yield newUser.save();
        //store the newUser in Redis cache
        yield redisClient_1.default.set(userCacheKey, JSON.stringify(savedUser));
        // To see the value of waht we are caching to the RedisClient
        const cachedUser = yield redisClient_1.default.get(userCacheKey);
        console.log(cachedUser);
        //  Return the saved user
        return res.status(201).json({ savedUser });
    }
    catch (error) {
        console.error("Error saving user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createUser = createUser;
// Update User
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = req.body;
        // Input validation
        if (!(email || name)) {
            return res.status(500).json({ message: "Email and fields are expected" });
        }
        const user = yield user_1.User.findOne({ email });
        //if not user
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Invalidate Cache (Manual override)
        yield redisClient_1.default.del("users");
        //update user name
        user.name = name;
        //save to the db
        yield user.save();
        yield redisClient_1.default.set("users", JSON.stringify(user));
        const cachedUser = yield redisClient_1.default.get("users");
        console.log(cachedUser);
        return res.json(user);
    }
    catch (error) {
        console.error("Error updating user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.UpdateUser = UpdateUser;
// Delete users
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ message: "Email field is expected" });
        }
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // remove email from the db
        yield user_1.User.deleteOne({ email });
        // clear redis cache
        yield redisClient_1.default.del("users");
        const cachedUser = yield redisClient_1.default.get("users");
        console.log(cachedUser);
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
// sign-in users
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //  Check if user exist in the database
        const foundUser = yield user_1.User.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (password !== foundUser.password) {
            return res.status(400).json({ message: "email or password invalid" });
        }
        // using the foundUser as our payload
        const token = (0, auth_1.generateToken)({ foundUser });
        return res.status(200).json({ message: "User login succesful", token });
    }
    catch (error) {
        console.error(error); //log the error for degging
        return res.status(500).json({ message: "Server error" });
    }
});
exports.signIn = signIn;
