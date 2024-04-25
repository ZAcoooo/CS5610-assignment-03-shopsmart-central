import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function AnonUserNavBar() {
  const { loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });

  return (
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
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarButtonsExample">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-primary px-3 me-2"
              onClick={loginWithRedirect}
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={signUp}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
