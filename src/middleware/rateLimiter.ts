import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient";


// creating requestQueue function 
const requestQueue: {[key:string]: Array<{req:Request, res: Response, next: NextFunction}>}  = {}

export const rateLimitter = (secondsWindow: number, allowedHits: number/**backoffFactor: number = 2**/) => {

    return async (req: Request, res:Response, next: NextFunction) => {     //anonymous middleware function
        // GET IP of request sender
        const ip = req.header("x-forwarded-for") //?? req.connection.remoteAddress!
            
        // console.log(ip?.slice(0, 3));

        // set the number of request of ip
        const requests = await redisClient.incr("ip")

        console.log(requests);

        // Set the expiry time of the limit e.g 3req/minute
        let ttl
        if (requests === 1) {
        await redisClient.expire("ip", secondsWindow) //if req is 1, we set the expiry time of the ip
        ttl = secondsWindow     // within 60 it can't send more than 3 reqs
        } else {
        // if the req != 1 we are time left to leave for that particular client(i)p
        ttl = await redisClient.ttl("ip")
        }

        console.log(`ttl: ${ttl}`);

        // checks for the number of request
        if (requests > allowedHits) {
            // // Exponential backoff strategy
            // // Calculate the retry after time using exponential backoff
            // const retryAfter = Math.min(ttl * backoffFactor, secondsWindow * Math.pow(backoffFactor, requests - allowedHits))

            // console.log(`Retry-After: ${retryAfter}`);
            
            // // Set retry after after in the header section
            // res.setHeader("Retry-After", retryAfter);

            // // Implement Queue strategy
            // //  If requests exceeds hits, then we queue the requests
            // if (!requestQueue[ip]) {
            //     // create request Queue based on the ip
            //     requestQueue[ip] = []
            // }
            
            // // push the request to the request queue
            // requestQueue[ip].push({req, res, next})

            // // Return request queue length
            // console.log(`Queued request. ${requestQueue[ip].length}`);
            
            res.status(503).json({message: "Too many requests have been sent. This request has been queued and will be processed later."})

            // // Process the queued request when the ttl expires
            // setTimeout( async () => {
            //     await processQueuedRequests(ip)
            // }, ttl * 1000)      // convert ttl to milliseconds 
        }  else {
            next();
        }
    }
}

