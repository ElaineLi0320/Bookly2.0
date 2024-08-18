import React, { useState } from "react";
import "../styles/BooksPage.css";

const CategoryFilter = ({ onSelectCategory }) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const categories = [
    { name: "New Arrivals", emoji: "🆕" },
    { name: "Top Rated", emoji: "👑" },
    { name: "Novel", emoji: "🖌️" },
    { name: "Philosophy", emoji: "💭" },
    { name: "Mysticism", emoji: "🔮" },
    { name: "Religion", emoji: "⛪️" },
    { name: "Science", emoji: "👩🏻‍💻" },
    { name: "History", emoji: "🏛️" },
    { name: "Business", emoji: "💼" },
  ];

  return (
    <div className="category-filter">
      {categories.slice(0, 2).map((category) => (
        <div key={category.name} className="filter-section">
          <span onClick={() => onSelectCategory(category.name)}>
            {category.emoji} {category.name}
          </span>
        </div>
      ))}
      <div className="filter-section categories">
        <span className="label">📚 Categories</span>
        <button onClick={toggleCategories}>
          {isCategoriesOpen ? "➖" : "➕"}
        </button>
      </div>
      {isCategoriesOpen && (
        <ul className="categories-dropdown">
          {categories.slice(2).map((category) => (
            <li key={category.name}>
              <span onClick={() => onSelectCategory(category.name)}>
                {category.emoji} {category.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryFilter;
