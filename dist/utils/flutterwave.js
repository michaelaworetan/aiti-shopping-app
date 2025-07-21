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
const Flutterwave = require("flutterwave-node-v3");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const Cart_1 = require("../controllers/Cart");
const user_1 = require("../models/user");
dotenv_1.default.config();
const secKey = String(process.env.FLW_SECRET_KEY);
// const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
//  Intialiaze payment
const intialiazePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //send request to flutterwave to initialize payment
        let { tx_ref, currency, redirect_url, email, phone_number, name } = req.body;
        const amount = yield (0, Cart_1.calculateTotalCost)(email);
        //   console.log(amount);
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        //   console.log(user.name);
        // creating a payload based on the parameters
        const payload = {
            tx_ref: tx_ref,
            amount: amount,
            currency: currency,
            redirect_url: redirect_url,
            payment_options: "card",
            customer: {
                email: email,
                phone_number: phone_number,
                name: user.name,
            },
            customizations: {
                title: "Payment for cart items",
                description: "Payment for XYZ Goods",
                logo: "",
            },
        };
        // Making use of payload as a request and sending to the flutterware api
        const response = yield axios_1.default.post("https://api.flutterwave.com/v3/payments", payload, {
            headers: requestHeaders(),
        });
        // console.log(response)
        // clear user's cart
        user.cartProducts = [];
        yield user.save();
        // Get result
        const result = response.data.data;
        return result;
    }
    catch (error) {
        console.error(error);
    }
});
// function for the requestHeader
function requestHeaders() {
    const headersRequest = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${secKey}`,
    };
    return headersRequest;
}
exports.default = intialiazePayment;
