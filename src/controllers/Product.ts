import { Request, Response } from "express";
import { Product } from "../models/product";

// get product(s)
export const getProducts = async(req: Request, res: Response) => {
    const products = await Product.find();
    res.json(products)
};

// create product
export const createProduct = async(req: Request, res: Response) => {
    const {  id, name, price} = req.body
    try {
       //Check if a product already exists with the provide
       const existingProduct = await Product.findOne({ id });
       if(existingProduct) {
          res.status(404).json({message: "Product already exists"})
          return
       }
       //create a new user instance from the provided data
       const newProduct= new Product({
        id, 
        name, 
        price
       });
 
       //Save the new User to the database
       await newProduct.save();
 
       //  Respond 
       res.status(201).json({ newProduct });   
    } catch (error) {
       console.error(error);  //log the error for degging
       res.status(500).json({ message: 'Server error' });   
    }
};
