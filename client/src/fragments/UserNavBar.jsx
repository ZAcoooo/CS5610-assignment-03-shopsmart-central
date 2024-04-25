import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, Link } from "react-router-dom";

export default function UserNavBar() {
  const { logout, user, isLoading } = useAuth0();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarButtonsExample"
            aria-controls="navbarButtonsExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarButtonsExample">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/app">
                  Home
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center">
              {isLoading ? (
                <div className="loading">Loading...</div>
              ) : (
                <>
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <span className="me-3 nav-link">Welcome 👋 {user.name}</span>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/app/profile">
                        Profile
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/app/debugger">
                        Auth Debugger
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/app/cart">
                        🛒
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/app/order">
                        Orders
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/app/review">
                        Reviews
                      </Link>
                    </li>
                    <button
                      type="button"
                      className="btn btn-primary me-3"
                      onClick={() =>
                        logout({ returnTo: window.location.origin })
                      }
                    >
                      Logout
                    </button>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}
