import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"

const tokenSecret = process.env.TOKEN_SECRET!
const tokenExpiration = "1 day"

// Generate a token after user has signed in 
export const generateToken = (payload: any) => {
    // return a signed token 
    const token = jwt.sign(payload, tokenSecret, {
        expiresIn: tokenExpiration
    });
    return token;
};


export const auth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "Authorization token is missing" });
            return; // Stop further execution
        }

        jwt.verify(token, tokenSecret, (err) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
                return; // Stop further execution
            }
            next(); // Proceed if the token is valid
        });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};