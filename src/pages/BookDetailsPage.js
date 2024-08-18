import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/BookDetailsPage.css";
import { useAuth0 } from "@auth0/auth0-react";

const BookDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/books/${id}`
        );
        const data = await response.json();
        setBook(data);

        const allBooksResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/books`
        );
        const allBooks = await allBooksResponse.json();
        const otherBooks = allBooks.filter((b) => b.id !== id);
        const shuffledBooks = otherBooks.sort(() => 0.5 - Math.random());
        setRelatedBooks(shuffledBooks.slice(0, 8));
      } catch (error) {
        console.error("Error fetching the book:", error);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/cart`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          setCartItems(data);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [isAuthenticated, getAccessTokenSilently]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (cartItems.some((item) => item.bookId === book.id)) {
      setMessage("This book is already in your cart.");
      setTimeout(() => setMessage(""), 700);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book.id, quantity: 1 }),
      });
      if (response.ok) {
        setCartItems([...cartItems, { bookId: book.id, quantity: 1 }]);
        setMessage("Added item to cart.");
        setTimeout(() => setMessage(""), 700);
      } else {
        setMessage("Failed to add item to cart.");
        setTimeout(() => setMessage(""), 700);
      }
    } catch (error) {
      setMessage("Failed to add item to cart.");
      setTimeout(() => setMessage(""), 700);
      console.error("Error adding item to cart:", error);
    }
  };

  if (!book) {
    return <div>Can't find book...</div>;
  }

  return (
    <div className="book-details">
      <div className="book-details-header">
        <img
          src={book.coverImage}
          alt={book.title}
          className="book-details-cover"
        />
        <div className="book-details-info">
          <h2 className="book-details-title">{book.title}</h2>
          <p className="book-details-price">${book.price}</p>
          <p className="book-details-author">{book.author}</p>
          <p className="book-details-category">{book.category}</p>
          <p className="book-details-rating">{book.rating} / 5</p>
          <p className="book-details-description">{book.description}</p>

          <button className="cart-details-button" onClick={addToCart}>
            Add to Cart
          </button>
          {message && <p className="cart-message">{message}</p>}
        </div>
      </div>

      <div className="related-books">
        <h3>You May Also Like</h3>
        <div className="related-books-list">
          {relatedBooks.map((relatedBook) => (
            <div key={relatedBook.id} className="related-book-card">
              <img
                src={relatedBook.coverImage}
                alt={relatedBook.title}
                className="related-book-cover"
              />
              <Link
                to={`/books/${relatedBook.id}`}
                className="related-book-title"
              >
                {relatedBook.title}
              </Link>
              <div className="related-book-info">
                <p className="related-book-author">{relatedBook.author}</p>
                <p className="related-book-price">${relatedBook.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
