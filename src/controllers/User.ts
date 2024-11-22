import { Request, Response } from "express";
import { User } from "../models/user";
import { generateToken } from "../middleware/auth";
import redisClient from "../utils/redisClient";

// get Users
export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    // await redisClient.del("ip");

    //Check if users are available in Redis cache
    // const cachedUsers = await redisClient.get("users")

    // if (cachedUsers) {
    //    //Check if users were found then log to the console
    //    console.log("Serving users from the cache");
    //    //return cached users in JDON format
    //    res.json(JSON.parse(cachedUsers))
    //    return;
    // }
    //if there are not in the cache, fetch from db
    const users = await User.find();
    //store the fetcheUsers in Redis cache
    // await redisClient.set("users", JSON.stringify(users))
    // //from the db
    // console.log("Serving users from the DB");

    // Return the users back to the client
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// create User
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const userCacheKey = "newUser";

    //Check if a user already exists with the provide email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User already exists" });
    }
    //Invalidate Users's cache(Manuel Override)
    await redisClient.del(userCacheKey);

    //create a new user instance from the provided data
    const newUser = new User({
      name,
      email,
      password,
    });

    //Save the new User to the database
    const savedUser = await newUser.save();

    //store the newUser in Redis cache
    await redisClient.set(userCacheKey, JSON.stringify(savedUser));

    // To see the value of waht we are caching to the RedisClient
    const cachedUser = await redisClient.get(userCacheKey);
    console.log(cachedUser);

    //  Return the saved user
    return res.status(201).json({ savedUser });
  } catch (error) {
    console.error("Error saving user: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update User
export const UpdateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, name } = req.body;

    // Input validation
    if (!(email || name)) {
      return res.status(500).json({ message: "Email and fields are expected" });
    }

    const user = await User.findOne({ email });

    //if not user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Invalidate Cache (Manual override)
    await redisClient.del("users");

    //update user name
    user.name = name;

    //save to the db
    await user.save();

    await redisClient.set("users", JSON.stringify(user));

    const cachedUser = await redisClient.get("users");
    console.log(cachedUser);

    return res.json(user);
  } catch (error) {
    console.error("Error updating user: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete users
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({ message: "Email field is expected" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove email from the db
    await User.deleteOne({ email });

    // clear redis cache
    await redisClient.del("users");

    const cachedUser = await redisClient.get("users");
    console.log(cachedUser);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// sign-in users
export const signIn = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    //  Check if user exist in the database
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (password !== foundUser.password) {
      return res.status(400).json({ message: "email or password invalid" });
    }
    // using the foundUser as our payload
    const token = generateToken({ foundUser });

    return res.status(200).json({ message: "User login succesful", token });
  } catch (error) {
    console.error(error); //log the error for degging
    return res.status(500).json({ message: "Server error" });
  }
};
