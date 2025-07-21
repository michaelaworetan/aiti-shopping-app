"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitter = void 0;
const redisClient_1 = __importDefault(require("../utils/redisClient"));
// creating requestQueue function 
const requestQueue = {};
const rateLimitter = (secondsWindow, allowedHits /**backoffFactor: number = 2**/) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // GET IP of request sender
        const ip = req.header("x-forwarded-for"); //?? req.connection.remoteAddress!
        // console.log(ip?.slice(0, 3));
        // set the number of request of ip
        const requests = yield redisClient_1.default.incr("ip");
        console.log(requests);
        // Set the expiry time of the limit e.g 3req/minute
        let ttl;
        if (requests === 1) {
            yield redisClient_1.default.expire("ip", secondsWindow); //if req is 1, we set the expiry time of the ip
            ttl = secondsWindow; // within 60 it can't send more than 3 reqs
        }
        else {
            // if the req != 1 we are time left to leave for that particular client(i)p
            ttl = yield redisClient_1.default.ttl("ip");
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
            res.status(503).json({ message: "Too many requests have been sent. This request has been queued and will be processed later." });
            // // Process the queued request when the ttl expires
            // setTimeout( async () => {
            //     await processQueuedRequests(ip)
            // }, ttl * 1000)      // convert ttl to milliseconds 
        }
        else {
            next();
        }
    });
};
exports.rateLimitter = rateLimitter;
