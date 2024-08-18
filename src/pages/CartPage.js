import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/CartPage.css";

const CartPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${apiUrl}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated, getAccessTokenSilently, apiUrl]);

  const handleRemoveItem = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${apiUrl}/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.patch(
        `${apiUrl}/cart/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <p>Please log in to view your cart.</p>
        <button className="login-button" onClick={() => loginWithRedirect()}>
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.book.title}</td>
                <td>{item.book.author}</td>
                <td>${item.book.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleUpdateQuantity(item.id, parseInt(e.target.value))
                    }
                  />
                </td>
                <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="cart-total">
        <h2>
          Total: $
          {cartItems
            .reduce((acc, item) => acc + item.book.price * item.quantity, 0)
            .toFixed(2)}
        </h2>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
