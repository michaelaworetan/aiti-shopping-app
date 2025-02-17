# Aiti Shopping App

Aiti Shopping App is a Node.js application that provides a backend for an e-commerce platform. It includes user authentication, product management, cart management, and payment processing using Flutterwave.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Product Routes](#product-routes)
  - [Cart Routes](#cart-routes)
  - [Payment Route](#payment-route)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/michaelaworetan/aiti-shopping-app.git
   ```

2. Navigate to the project directory:

   ```sh
   cd aiti-shopping-app
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```sh
   MONGO_URL=your_mongodb_connection_string
   TOKEN_SECRET=your_jwt_secret
   REDIS_URL=your_redis_url
   FLW_PUBLIC_KEY=your_flutterwave_public_key
   FLW_SECRET_KEY=your_flutterwave_secret_key
   ```

## Usage

To start the application in development mode:

```sh
npm run dev
```

To build the application:

```sh
npm run build
```

To start the application in production mode:

```sh
npm start
```

## API Endpoints

### User Routes

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `POST /api/users/updateUser` - Update a user
- `DELETE /api/users/deleteUser` - Delete a user
- `POST /api/users/signin` - Sign in a user

### Product Routes

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product

### Cart Routes

- `POST /api/carts/addToCart` - Add a product to the cart
- `POST /api/carts/removeFromCart` - Remove a product from the cart
- `POST /api/carts/updateProductInCart` - Update product quantity in the cart
- `POST /api/carts/testcalculateTotalCost` - Calculate total cost of products in the cart

### Payment Route

- `POST /pay` - Initialize payment using Flutterwave

## Environment Variables

- `MONGO_URL` - MongoDB connection string
- `TOKEN_SECRET` - JWT secret key
- `REDIS_URL` - Redis connection URL
- `FLW_PUBLIC_KEY` - Flutterwave public key
- `FLW_SECRET_KEY` - Flutterwave secret key

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

