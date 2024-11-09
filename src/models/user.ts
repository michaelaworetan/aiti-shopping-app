import {Schema, model } from "mongoose"

interface User{
    name: string
    email: string
    password: string
    products: string[]
}

const userSchema = new Schema<User>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    products: {type: [String], required: true}
})

export const User = model<User>("User", userSchema)