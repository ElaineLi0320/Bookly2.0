import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "../styles/Header.css";

const Header = () => {
  const { isAuthenticated, logout } = useAuth0();

  return (
    <header className="header">
      <div className="logo">✿Bookly</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/books">All books</Link>
        <Link to="/cart">Cart</Link>

        {isAuthenticated ? (
          <>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
