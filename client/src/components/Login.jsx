import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () =>
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">
                Shopsmart Central App
              </h1>
              <div className="text-center">
                {!isAuthenticated ? (
                  <button
                    className="btn btn-primary btn-block mb-3 me-2"
                    onClick={loginWithRedirect}
                  >
                    Login
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-block mb-3 me-2"
                    onClick={() => navigate("/app")}
                  >
                    Enter App
                  </button>
                )}
                <button
                  className="btn btn-secondary btn-block mb-3 me-2"
                  onClick={signUp}
                >
                  Sign Up
                </button>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary mb-3 me-2"
                  onClick={() => navigate("/")}
                >
                  Go Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
