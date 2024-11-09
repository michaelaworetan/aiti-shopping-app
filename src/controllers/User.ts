import { Request, Response } from "express";
import { User } from "../models/user";
import { generateToken } from "../middleware/auth";


// get Users
export const getUsers = async (req: Request, res: Response) => {
    const users = await User.find()
    res.json(users)
};

// create User
export const createUser = async (req: Request, res: Response) => {
   const { name, email, password} = req.body
   try {
      //Check if a user already exists with the provide email
      const existingUser = await User.findOne({ email });
      if(existingUser) {
         res.status(404).json({message: "User already exists"})
         return
      }
      //create a new user instance from the provided data
      const newUser= new User({
      name,
      email,
      password 
      });

      //Save the new User to the database
      await newUser.save();

      //  Respond 
      res.status(201).json({ newUser });   
   } catch (error) {
      console.error(error);  //log the error for degging
      res.status(500).json({ message: 'Server error' });   
   } 
};

// sign-in users
export const signIn = async(req: Request, res: Response) => {
    const { email, password } = req.body 
    try {
         //  Check if user exist in the database
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
         res.status(400).json({ message: 'Invalid email or password'});
         return;
      }

      if (password !== foundUser.password ) {
            res.status(400).json({ message: "email or password invalid"})
            return;
         }
      // using the foundUser as our payload
      const token = generateToken({foundUser})

      res.status(200).json({message: "User login succesful", token});
      return;
      } catch (error){
         console.error(error);  //log the error for degging
         res.status(500).json({ message: 'Server error' });   
      }
};

// add products to cart
export const addProductToCart = async (req: Request, res: Response) => {
   const { id } = req.params
    const { name, productId } = req.body
   try {
      //  Check if user exist in the database
    const user = await User.findByIdAndUpdate(id, {name, products: productId });

    if (!user) {
       res.status(400).json({ message: 'Invalid email or password'});
       return;
    }
     res.status(200).json({ message: "products added to cart successfully", user})
   } catch (error) {
      console.error(error);  //log the error for degging
      res.status(500).json({ message: 'Server error' });   
   }
};
