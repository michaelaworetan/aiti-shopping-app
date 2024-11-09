import express  from "express";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import bodyParser from "body-parser";
import { connectToDb } from "./database/db";

const app = express();

app.use(bodyParser.json());

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

connectToDb();

app.listen(3000, () => {
    console.log("Server is running")
});