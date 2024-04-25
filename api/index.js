import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Get all products
app.get("/products", async (req, res) => {
  const products = await prisma.productItem.findMany();

  res.json(products);
});

// Get a product item by id
app.get("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const productItem = await prisma.productItem.findUnique({
    where: {
      id,
    },
    include: {
      reviews: true,
    },
  });
  res.json(productItem);
});

// Creates a product item
app.post("/products", async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  if (!name || !price || !category || !imageUrl) {
    res.status(400).send("name, price, category, and imageUrl are required");
  } else {
    const newProduct = await prisma.productItem.create({
      data: {
        name,
        description,
        price,
        category,
        imageUrl,
        reviews: { create: [] },
      },
    });

    res.status(201).json(newProduct);
  }
});

// Deletes a product item by id
app.delete("/products/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.review.deleteMany({
    where: {
      productId: product.id,
    },
  });
  const deletedProduct = await prisma.productItem.delete({
    where: {
      id,
    },
  });
  res.json(deletedProduct);
});

// Updates a product item by id
app.put("/products/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, category, imageUrl } = req.body;
  const updatedProduct = await prisma.productItem.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      price,
      category,
      imageUrl,
    },
  });
  res.json(updatedProduct);
});

// get user shopping cart
app.get("/shoppingCart", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  // find the user
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const shoppingCart = await prisma.shoppingCart.findUnique({
    where: {
      userId: user.id,
    },
  });

    // find all products in the shopping cart
    const shoppingCartProducts = await prisma.shoppingCartProduct.findMany({
      where: {
        shoppingCartId: shoppingCart.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    // format the response with product information and quantity
    const formattedProducts = shoppingCartProducts.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      quantity: item.quantity,
    }));

    res.json(formattedProducts);
});

// Add product to cart
app.post("/shoppingCart/add", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { productId, quantity } = req.body;

  const parsedProductId = parseInt(productId);
  const parsedQuantity = parseInt(quantity);
  // find the user
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const shoppingCart = await prisma.shoppingCart.findUnique({
    where: {
      userId: user.id,
    },
  });

  // Check if the product already exists in the cart
  const existingCartItem = await prisma.shoppingCartProduct.findFirst({
    where: {
      shoppingCartId: shoppingCart.id,
      productId: parsedProductId,
    },
  });

  let updatedShoppingCart;

  // If the product exists, update its quantity
  if (existingCartItem) {
    updatedShoppingCart = await prisma.shoppingCartProduct.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: {
          increment: parsedQuantity,
        },
      },
    });
  } else {
    // If the product doesn't exist, add it to the cart
    updatedShoppingCart = await prisma.shoppingCartProduct.create({
      data: {
        product: {
          connect: {
            id: parsedProductId,
          },
        },
        shoppingCart: {
          connect: {
            id: shoppingCart.id,
          },
        },
        quantity: parsedQuantity,
      },
    });
  }


  res.json(updatedShoppingCart);
});

// Remove product from cart
app.delete("/shoppingCart/remove/:productId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const productId = parseInt(req.params.productId);

  // find the user
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const shoppingCart = await prisma.shoppingCart.findUnique({
    where: {
      userId: user.id,
    },
  });

  const existingCartItem = await prisma.shoppingCartProduct.findFirst({
    where: {
      shoppingCartId: shoppingCart.id,
      productId: productId,
    },
  });

  const deleteCartProduct = await prisma.shoppingCartProduct.delete({
    where: {
      id: existingCartItem.id,
    },
  });
  res.json(deleteCartProduct);
});

// Update the product quantity in the cart
app.put("/shoppingCart/update", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const productId = parseInt(req.body.productId);
  const newQuantity = parseInt(req.body.quantity);

  // Find the user
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  // Find the shopping cart for the user
  const shoppingCart = await prisma.shoppingCart.findUnique({
    where: {
      userId: user.id,
    },
  });

  // Find the cart item for the specified product
  const cartItem = await prisma.shoppingCartProduct.findFirst({
    where: {
      shoppingCartId: shoppingCart.id,
      productId: productId,
    },
  });

  let updateProduct;

  // If the new quantity is 0, delete the product from the cart
  if (newQuantity === 0) {
    updateProduct = await prisma.shoppingCartProduct.delete({
      where: {
        id: cartItem.id,
      },
    });
  } else {
    // Update the quantity of the cart item
    updateProduct = await prisma.shoppingCartProduct.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: newQuantity,
      },
    });
  }

  res.json(updateProduct);
});

app.get("/reviews", async (req, res) => {
  const reviews = await prisma.review.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });
  res.json(reviews);
});

// Create a new review for a product
app.post("/products/:productId/reviews", requireAuth, async (req, res) => {
  const productId = parseInt(req.params.productId);
  const { comment } = req.body;
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const newReview = await prisma.review.create({
    data: {
      comment,
      productId,
      userId: user.id,
    },
  });

  res.json(newReview);
});

// Delete a review
app.delete("/reviews/:reviewId", requireAuth, async (req, res) => {
  const reviewId = parseInt(req.params.reviewId);
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const deleteReview = await prisma.review.delete({
    where: {
      id: reviewId,
      userId: user.id,
    },
  });
  res.json(deleteReview);
});

// Get reviews by product ID
app.get("/reviews/product/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);

  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
  });

  res.json(reviews);
});

// Get reviews by user ID
app.get("/reviews/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const reviews = await prisma.review.findMany({
    where: {
      userId: user.id,
    },
  });

  res.json(reviews);
});


// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

// Updates a product item by id
app.put("/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { shippingAddress, phoneNumber } = req.body;
  const updatedUser = await prisma.user.update({
    where: {
      auth0Id,
    },
    data: {
      shippingAddress,
      phoneNumber,
    },
  });
  res.json(updatedUser);
});

// create a new order
app.post("/orders", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
      include: {
        shoppingCart: {
          include: {
            products: true,
          },
        },
      },
    });

    // If the user has no shopping cart, return an error
    if (!user.shoppingCart || user.shoppingCart.products.length === 0) {
      return res.status(400).json({ error: "Shopping cart is empty" });
    }

    // Create a new order for the user
    const order = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Create order product items for each product in the shopping cart
    const orderProductItems = await Promise.all(
      user.shoppingCart.products.map(async (product) => {
        const orderProductItem = await prisma.orderProductItem.create({
          data: {
            order: {
              connect: {
                id: order.id,
              },
            },
            products: {
              connect: {
                id: product.id,
              },
            },
            quantity: product.quantity,
          },
        });
        return orderProductItem;
      })
    );

    // Clean the user's shopping cart
    await prisma.shoppingCartProduct.deleteMany({
      where: {
        shoppingCartId: user.shoppingCart.id,
      },
    });

    // Return the created order
    res.json({ order, orderProductItems });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// get orders by the user id
app.get("/orders", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const userOrderHistory = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      orderItem: {
        include: {
          products: true,
        },
      },
    },
  });
  res.json(userOrderHistory);
});

// get order by the order id
app.get("/orders/:orderId", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
    const userId = user.id;
    const orderId = parseInt(req.params.orderId);

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        userId: true,
      },
    });

    if (!order || order.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const orderProductItems = await prisma.orderProductItem.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        products: true,
      },
    });

    res.json(orderProductItems);
  } catch (error) {
    console.error("Error fetching order product items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });
    await prisma.shoppingCart.create({
      data: {
        user: {
          connect: {
            id: newUser.id,
          },
        },
      },
    });
    res.json(newUser);
  }
});

const PORT = parseInt(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
