import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Homepage.css";

const Homepage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cartBooks, setCartBooks] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [carouselBooks, setCarouselBooks] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const booksPerSlide = 6;
  const totalSlides = Math.ceil(carouselBooks.length / booksPerSlide);
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/books");
  };

  useEffect(() => {
    // Fetch books for sliding carousel
    const apiUrl = process.env.REACT_APP_API_URL;

    fetch(`${apiUrl}/books`)
      .then((response) => response.json())
      .then((data) => {
        const shuffledBooks = data.sort(() => 0.5 - Math.random());
        setCarouselBooks(shuffledBooks.slice(0, 36));
      })
      .catch((error) => console.error("Error fetching books:", error));

    // Fetch all books to get cover images and top picks
    fetch(`${apiUrl}/books`)
      .then((response) => response.json())
      .then((data) => {
        const shuffledBooks = data.sort(() => 0.5 - Math.random());
        setTopPicks(shuffledBooks.slice(0, 20));
      })
      .catch((error) => console.error("Error fetching books:", error));

    // Fetch user cart
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => {
          fetch(`${apiUrl}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((response) => response.json())
            .then((data) => setCartBooks(data))
            .catch((error) =>
              console.error("Error fetching user cart:", error)
            );
        })
        .catch((error) => console.error("Error fetching token:", error));
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleExploreMore = () => {
    navigate("/books");
  };

  const goToSlide = (index) => {
    if (index < 0) {
      setCurrentSlide(totalSlides - 1);
    } else if (index >= totalSlides) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="homepage">
      {/* Banner Section */}
      <section className="welcome-banner">
        <div className="welcome-info">
          <h2>🎉 10% OFF for new user</h2>
          <p>with code: NEW10</p>
          <button onClick={handleShopNow} className="shop-now-button">
            Shop Now
          </button>
        </div>
        <div className="carousel">
          <button onClick={prevSlide} className="carousel-button prev">
            ❮
          </button>
          <div className="carousel-slides">
            {carouselBooks.length > 0 ? (
              <div
                className="carousel-inner"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div className="carousel-slide" key={slideIndex}>
                    {carouselBooks
                      .slice(
                        slideIndex * booksPerSlide,
                        (slideIndex + 1) * booksPerSlide
                      )
                      .map((book) => (
                        <Link
                          key={book.id}
                          to={`/books/${book.id}`}
                          className="book-cover-link"
                        >
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="book-cover"
                          />
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            ) : (
              <p>No available books.</p>
            )}
          </div>
          <button onClick={nextSlide} className="carousel-button next">
            ❯
          </button>
        </div>
      </section>

      <main className="main-area">
        <section className="top-picks-section">
          <h2>✨ Top Picks for You</h2>
          <div className="top-picks-cards">
            {topPicks.length > 0 ? (
              topPicks.map((book) => (
                <div key={book.id} className="top-pick-card">
                  <Link
                    to={`/books/${book.id}`}
                    className="top-pick-link"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <img src={book.coverImage} alt={book.title} />
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No top picks available.</p>
            )}
          </div>
          <button onClick={handleExploreMore} className="explore-more-button">
            Explore More
          </button>
        </section>

        {isAuthenticated ? (
          <section className="user-section">
            <h2>Your Cart</h2>
            {cartBooks.length > 0 ? (
              <div className="cart-books">
                {cartBooks.slice(0, 10).map((cartItem) => (
                  <Link
                    key={cartItem.book.id}
                    to={`/books/${cartItem.book.id}`}
                    className="book-cover-link"
                  >
                    <img
                      src={cartItem.book.coverImage}
                      alt={cartItem.book.title}
                      className="cart-book-cover"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p>No books in your cart.</p>
            )}
            <button onClick={handleGoToCart} className="go-to-cart-button">
              View Cart
            </button>
          </section>
        ) : (
          <section className="login-prompt">
            <h2>💕 Access To Your Cart</h2>
            <p>You need to be logged in to view your cart.</p>
            <button onClick={handleLoginRedirect} className="login-button">
              Log In / Register
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Homepage;
