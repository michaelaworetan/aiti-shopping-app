import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const uri = process.env.MONGO_URL!

export const connectToDb = async (): Promise<void> => {
    await connect(uri)
    .then(() => console.log('connected to the db'))
    .catch(err => console.error('Failed to connect to the db', err));
}