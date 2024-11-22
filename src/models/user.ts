import { Schema, model } from "mongoose";

// cartProduct interface
interface CartProduct {
  productId: Schema.Types.ObjectId;
  quantity: number;
}

// User Interface including a cartProducts property which is based on the CartProduct interface
interface User {
  name: string;
  email: string;
  password: string;
  cartProducts: CartProduct[];
}

// cartProduct Schema
const cartProductSchema = new Schema<CartProduct>({
  productId: { type: Schema.Types.ObjectId, ref: "product" },
  quantity: { type: Number, required: true },
});

// userSChema including a cartProducts Property which is based on cartProductSchema
const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartProducts: { type: [cartProductSchema], default: [] },
});

// User model using on user interface based on userSchema
export const User = model<User>("User", userSchema);
