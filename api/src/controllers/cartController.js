import prisma from "../models/client.js";

// Check if the user is registered
export const checkUserRegistration = async (req, res, next) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(401).json({ error: "User not registered." });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while verifying the user." });
  }
};

// Get items in the cart
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { book: true },
    });
    res.json(cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching cart items." });
  }
};

// Add item to the cart
export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;

    console.log(
      "Adding to cart - UserID:",
      userId,
      "BookID:",
      bookId,
      "Quantity:",
      quantity
    );

    if (!bookId || !quantity) {
      return res.status(400).json({ error: "Missing bookId or quantity." });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be greater than 0." });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    const cartItem = await prisma.cart.create({
      data: {
        userId,
        bookId,
        quantity,
      },
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding item to cart." });
  }
};

// Remove item from the cart
export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    await prisma.cart.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Item removed from cart." });
  } catch (error) {
    console.error("Error", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing item from cart." });
  }
};

// Update quantity of item in the cart
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity." });
    }

    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    const updatedCartItem = await prisma.cart.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });

    res.json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating cart item quantity." });
  }
};
