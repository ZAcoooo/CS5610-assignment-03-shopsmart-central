import React, { useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import FakeStoreAPI from "../api/FakeStoreAPI";
import RecentReview from "./RecentReview";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import AnonUserNavBar from "../fragments/AnonUserNavBar";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated, navigate]);

  const onAddToCart = async (id, quantity) => {
    if (!isAuthenticated) {
      navigate("/register");
    } else {
      const confirmed = window.confirm("Are you sure you want to add this item to your cart?");
      if (!confirmed) {
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/shoppingCart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: quantity,
        }),
      });
      if (response.ok) {
        console.log("Product added to cart successfully");
      } else {
        console.error("Failed to add product to cart");
      }
    }
  };


  return (
    <div className="home">
      {!isAuthenticated ? <AnonUserNavBar /> : null}
      <div className="container">
        <div className="row">
          <FakeStoreAPI onAddToCart={onAddToCart} />
          <RecentReview />
        </div>
      </div>
    </div>
  );
}
