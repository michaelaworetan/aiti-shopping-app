import { Request, Response } from "express";
import { User } from "../models/user";
import { generateToken } from "../middleware/auth";
import redisClient from "../utils/redisClient";


// get Users
export const getUsers = async (req: Request, res: Response) => {
   try {
      // await redisClient.del("users");
      //Check if users are available in Redis cache
      const cachedUsers = await redisClient.get("users")

      if (cachedUsers) {
         //Check if users were found then log to the console
         console.log("Serving users from the cache");
         //return cached users in JDON format
         res.json(JSON.parse(cachedUsers))
         return;
      }
      //if there are not in the cache, fetch from db
      const users = await User.find()
      //store the fetcheUsers in Redis cache
      await redisClient.set("users", JSON.stringify(users))
      //from the db
      console.log("Serving users from the DB");

      // Return the users back to the client
      res.json(users)
   } catch (error) {
       console.error("Error fetching users: ", error)
       res.status(500).json({error: "Internal Server Error"});
   }
};

// create User
export const createUser = async (req: Request, res: Response) => {
   try {
      const { name, email, password} = req.body
      const userCacheKey = "newUser";

      //Check if a user already exists with the provide email
      const existingUser = await User.findOne({ email });
      if(existingUser) {
         res.status(404).json({message: "User already exists"})
         return
      }
      //Invalidate Users's cache(Manuel Override)
      await redisClient.del(userCacheKey);

      //create a new user instance from the provided data
      const newUser= new User({
      name,
      email,
      password 
      });

      //Save the new User to the database
      const savedUser = await newUser.save();

      //store the newUser in Redis cache
      await redisClient.set(userCacheKey, JSON.stringify(savedUser))

      // To see the value of waht we are caching to the RedisClient
      const cachedUser = await redisClient.get(userCacheKey)
      console.log(cachedUser);
      
      //  Return the saved user
      res.status(201).json({ savedUser });   
   } catch (error) {
      console.error("Error saving user: ", error)
      res.status(500).json({error: "Internal Server Error"});  
   } 
};

// Update User
export const UpdateUser = async (req: Request, res: Response) => {

   try {
      const { email, name }= req.body;

      // Input validation
      if (!(email || name)) {
         res.status(500).json({message: "Email and fields are expected"})
         return
      }

      const user = await User.findOne({ email })

      //if not user
      if (!user) {
         res.status(404).json({message: "User not found"})
         return
      }

      // Invalidate Cache (Manual override)
      await redisClient.del("users")

      //update user name
      user.name = name

      //save to the db
      await user.save()

      await redisClient.set("users", JSON.stringify(user))

      const cachedUser = await redisClient.get("users")
      console.log(cachedUser);

      res.json(user)   
   } catch (error) {
      console.error("Error updating user: ", error)
      res.status(500).json({error: "Internal Server Error"}); 
   }
}

// Delete users
export const deleteUser = async(req: Request, res: Response) => {
   try {
      const { email } = req.body

      if (!email) {
         res.status(404).json({ message: "Email field is expected" })
         return
      }

      const user = await User.findOne({ email })

      if (!user) {
         res.status(404).json({ message: "User not found" })
         return
      }

      // remove email from the db
      await User.deleteOne({ email })

      // clear redis cache
      await redisClient.del("users")

      const cachedUser = await redisClient.get("users")
      console.log(cachedUser);

      res.status(200).json({ message: "User deleted successfully" })

   } catch (error) {
      console.error("Error deleting user: ", error)
      res.status(500).json({error: "Internal Server Error"}); 
   }
}

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
