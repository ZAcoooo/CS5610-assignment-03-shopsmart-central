import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductDescription from "./components/ProductDescription";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import Login from "./components/Login";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Review from "./components/Review";
import OrderDetail from "./components/OrderDetail";
import WriteComment from "./components/WriteComment";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import UserNavBar from "./fragments/UserNavBar";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

const requestedScopes = ["profile", "email"];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  // If the user is not authenticated, redirect to the home page
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, display the children (the protected page)
  return children;
}

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/details/:id" element={<ProductDescription />} />
            <Route path="/register" element={<Login />} />
            <Route
              path="app"
              element={
                <RequireAuth>
                  <UserNavBar />
                </RequireAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="debugger" element={<AuthDebugger />} />
              <Route path="cart" element={<Cart />} />
              <Route path="order" element={<Order />} />
              <Route path="review" element={<Review />} />
              <Route path="order/:id" element={<OrderDetail />} />
              <Route path="order/:id/:productId" element={<WriteComment />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
