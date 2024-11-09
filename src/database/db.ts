import { connect } from "mongoose";

const uri = "mongodb+srv://mike:9059@cluster0.mntgklv.mongodb.net/middleware-db"

export const connectToDb = async (): Promise<void> => {
    await connect(uri)

    console.log(`connected to the db: ${uri}`)
}