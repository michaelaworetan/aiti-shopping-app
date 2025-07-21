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
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./database/db");
const flutterwave_1 = __importDefault(require("./utils/flutterwave"));
// import { auth } from "./middleware/auth";
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/carts", cartRoutes_1.default);
app.post("/pay", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, flutterwave_1.default)(req, res);
    res.json(result);
}));
(0, db_1.connectToDb)();
app.listen(3000, () => {
    console.log("Server is running");
});
