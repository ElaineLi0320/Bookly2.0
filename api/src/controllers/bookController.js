import prisma from "../models/client.js";

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
};

// Get a single book by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the book." });
  }
};

// Create new books
export const createBooks = async (req, res) => {
  try {
    const books = req.body;

    // Validate the data
    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        error: "Books' information is not complete or incorrect format.",
      });
    }

    // Check if each book has all required fields
    const areBooksValid = books.every((book) => {
      return (
        book.title &&
        book.author &&
        book.price &&
        book.category &&
        book.rating &&
        book.coverImage
      );
    });

    if (!areBooksValid) {
      return res
        .status(400)
        .json({ error: "All fields are required for each book." });
    }

    // Create multiple books
    const newBooks = await prisma.book.createMany({
      data: books,
      skipDuplicates: true, // Optional: skips books that already exist (based on unique constraints)
    });

    res.status(201).json(newBooks);
  } catch (error) {
    console.error("Error creating books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the books." });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, price, category, rating, coverImage } =
      req.body;

    if (!title || !author || !price || !category || !rating || !coverImage) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, description, price, category, rating, coverImage },
    });

    res.json(updatedBook);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the book." });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await prisma.book.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedBook);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the book." });
  }
};

// Delete all books
export const deleteAllBooks = async (req, res) => {
  try {
    const deleteResult = await prisma.book.deleteMany({});
    res.json({
      message: "All books have been deleted.",
      count: deleteResult.count, // Optional: number of books deleted
    });
  } catch (error) {
    console.error("Error deleting all books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting all books." });
  }
};
