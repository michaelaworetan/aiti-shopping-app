import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const uri = process.env.MONGO_URL!

export const connectToDb = async (): Promise<void> => {
    await connect(uri)

    console.log("connected to the db")
}