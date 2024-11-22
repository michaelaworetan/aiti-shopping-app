import { Request, Response } from "express";
import { User } from "../models/user";
import { Product } from "../models/product";

// Add Products to Cart
export const addToCart = async (req: Request, res: Response): Promise<any> => {
  try {
    //Get the produt user wants to add
    const { email, productId, quantity } = req.body;

    //Get the user
    const user = await User.findOne({ email });

    //Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the productId using our Product model
    const product = await Product.findById(productId);

    //Check if the productId exist in our product database
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //Check if product exist in our cartProducts
    const cartItem = user.cartProducts.find(
      (item) => item.productId.toString() === productId
    );

    // if the cartItem exists
    if (cartItem) {
      // Update the quantity
      cartItem.quantity += quantity;
    } else {
      // Push new product to cart
      user.cartProducts.push({ productId, quantity });
    }
    // save the user to the database
    const updateUser = await user.save();

    return res.status(200).json({ message: "added to cart", updateUser });
  } catch (error) {
    console.error("Error adding products to carts: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove Products to Cart
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    //Get the produt user wants to remove
    const { email, productId } = req.body;

    //Get the user
    const user = await User.findOne({ email });

    //Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the productId using our Product model
    const product = await Product.findById(productId);

    //Check if the productId exist in our product database
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Filter out the product fro the cart array
    user.cartProducts = user.cartProducts.filter(
      (item) => item.productId.toString() !== productId
    );

    // save the user to the database
    const filteredUser = await user.save();

    return res.status(200).json({ message: "Removed from cart", filteredUser });
  } catch (error) {
    console.error("Error removing products from carts: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Change Products quantity from Cart
export const updateProductInCart = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    //Get the produt user wants to remove
    const { email, productId, quantity } = req.body;

    // Check if quantity is greater than 0
    if (quantity <= 0) {
      return res
        .status(404)
        .json({ message: "quantity must be greater than 0" });
    }

    //Get the user
    const user = await User.findOne({ email });

    //Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the productId using our Product model
    const product = await Product.findById(productId);

    //Check if the productId exist in our product database
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find an item using productId
    const cartItem = user.cartProducts.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "product does not exist in cart" });
    }

    // Modify cart quantity
    cartItem.quantity = quantity;

    // save the user to the database
    const modifiedUser = await user.save();

    return res
      .status(200)
      .json({ message: "product updated in cart", modifiedUser });
  } catch (error) {
    console.error("Error updating Cart Item: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Calculate total Products price in Cart
export const calculateTotalCost = async (email: string): Promise<number> => {
  // Get the user by email
  const user = await User.findOne({ email });

  //Check if user exists
  if (!user) {
    throw new Error("User not found");
  }

  let totalCost = 0;

  // total cost using for..of loop
  for (const cartItem of user.cartProducts) {
    // for each cartItem of user.cartProducts
    // find the product by the id
    const product = await Product.findById(cartItem.productId);

    // check if the product exists
    if (product) {
      const itemCost = parseFloat(product.price) * cartItem.quantity;

      // add the item cost into totaCost
      totalCost += itemCost;
    }
  }

  return totalCost;
};

// To test calculateTotalCost
export const testcalculateTotalCost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Get email from the req.body
    const { email } = req.body;

    // Get the user by email
    const user = await User.findOne({ email });

    //Check if user exists
    if (!user) {
      throw new Error("User not found");
    }

    let totalCost = 0;

    // total cost using for..of loop
    for (const cartItem of user.cartProducts) {
      // for each cartItem of user.cartProducts
      // find the product by the id
      const product = await Product.findById(cartItem.productId);

      // check if the product exists
      if (product) {
        const itemCost = parseFloat(product.price) * cartItem.quantity;

        // add the item cost into totaCost
        totalCost += itemCost;
      }
    }

    return res.status(200).json(`Total cost is ${totalCost}`);
  } catch (error) {
    console.error("Error updating Cart Item: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
