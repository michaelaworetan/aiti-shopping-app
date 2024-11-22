import express, { Request, Response } from "express";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import bodyParser from "body-parser";
import { connectToDb } from "./database/db";
import intialiazePayment from "./utils/flutterwave";
// import { auth } from "./middleware/auth";

const app = express();

app.use(bodyParser.json());

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/carts", cartRoutes);

app.post("/pay", async (req: Request, res: Response) => {
    const result = await intialiazePayment(req, res)

    res.json(result)
})

connectToDb();

app.listen(3000, () => {
  console.log("Server is running");
});
