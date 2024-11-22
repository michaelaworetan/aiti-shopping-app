import { Router } from "express";
import {
  addToCart,
  removeFromCart,
  testcalculateTotalCost,
  updateProductInCart,
} from "../controllers/Cart";

const router = Router();

//  addCart Routes
router.post("/addToCart", addToCart);

//  remove Products from cart Routes
router.post("/removeFromCart", removeFromCart);

// update product in cart Routes
router.post("/updateProductInCart", updateProductInCart);

// Total cost  Routes
router.post("/testcalculateTotalCost", testcalculateTotalCost);

export default router;
