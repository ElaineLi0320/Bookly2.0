import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import "../styles/BooksPage.css";

const BooksPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;

    fetch(`${apiUrl}/books`)
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Function to shuffle the books array
  const shuffleBooks = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const filteredBooks = selectedCategory
    ? selectedCategory === "New Arrivals"
      ? books.slice(-21)
      : selectedCategory === "Top Rated"
      ? books.sort((a, b) => b.rating - a.rating).slice(0, 21)
      : books.filter((book) => book.category === selectedCategory)
    : shuffleBooks(books);

  return (
    <div className="books-page">
      <CategoryFilter onSelectCategory={handleCategorySelect} />
      <div className="books-list">
        {filteredBooks.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="books-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="books-card-content">
              <img
                src={book.coverImage}
                alt={book.title}
                className="books-cover"
              />
              <div className="books-details">
                <h3 className="books-title">{book.title}</h3>
                <p className="books-author">{book.author}</p>
                <p className="books-price">${book.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BooksPage;
