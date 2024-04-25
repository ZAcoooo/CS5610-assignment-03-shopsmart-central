import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/shoppingCart`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
          calculateTotalPrice(data);
        } else {
          console.error("Failed to fetch cart");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [accessToken]);

  const calculateTotalPrice = (items) => {
    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(totalPrice);
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item from your cart?"
    );
    if (!confirmed) {
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/shoppingCart/remove/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      setCartItems(cartItems.filter((item) => item.id !== productId));
      calculateTotalPrice(cartItems.filter((item) => item.id !== productId));
    } else {
      console.error("Failed to delete item from cart");
    }
  };

  const handleCheckout = async () => {
    const confirmed = window.confirm("Are you sure you want to checkout?");
    if (!confirmed) {
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      navigate("/app/order");
    } else {
      console.error("Failed to create order");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Shopping Cart</h1>
      <ul className="list-group mb-4 border rounded" style={{ maxHeight: "600px", overflowY: "auto" }}>
        {cartItems.map((item) => (
          <li key={item.id} className="list-group-item mb-1 border rounded">
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="img-thumbnail img-fluid mx-auto"
                  style={{ maxHeight: "200px", maxWidth: "200px" }}
                />
              </div>
              <div className="col-md-7">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <button
        className="btn btn-primary"
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  );
}
