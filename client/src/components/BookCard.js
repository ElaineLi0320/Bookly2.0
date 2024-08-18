import React from "react";
import "../styles/BookCard.css";

const BookCard = ({ title, author, description }) => {
  return (
    <div className="book-card">
      <h3>{title}</h3>
      <p>Author: {author}</p>
      <p>{description}</p>
    </div>
  );
};

export default BookCard;
