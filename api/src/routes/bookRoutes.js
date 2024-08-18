import express from "express";
import {
  getBooks,
  getBookById,
  createBooks,
  updateBook,
  deleteBook,
  deleteAllBooks,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.delete("/", deleteAllBooks);

export default router;
