import {Schema, model } from "mongoose"

export interface Product{
    id: string
    name: string
    price: string
}

const productSchema = new Schema<Product>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: String, required: true}
})

export const Product = model<Product>("Product", productSchema)