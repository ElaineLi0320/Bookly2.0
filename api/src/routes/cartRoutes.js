import express from "express";
import {
  getCartItems,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  checkUserRegistration,
} from "../controllers/cartController.js";
import { auth } from "express-oauth2-jwt-bearer";

// Middleware to validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const router = express.Router();

router.get("/", requireAuth, checkUserRegistration, getCartItems);
router.post("/", requireAuth, checkUserRegistration, addItemToCart);
router.delete("/:id", requireAuth, checkUserRegistration, removeItemFromCart);
router.patch(
  "/:id",
  requireAuth,
  checkUserRegistration,
  updateCartItemQuantity
);

export default router;
