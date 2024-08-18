import React, { useState } from "react";

const BookSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
    setQuery("");
  };

  return (
    <div className="book-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a book..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default BookSearch;
