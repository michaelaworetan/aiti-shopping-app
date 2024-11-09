"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./database/db");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
(0, db_1.connectToDb)();
app.listen(3000, () => {
    console.log("Server is running");
});
