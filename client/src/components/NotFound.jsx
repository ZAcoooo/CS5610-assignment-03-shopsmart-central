import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">404 - Not Found</h2>
              <p className="card-text text-center">
                The page you are looking for does not exist.
              </p>
              <div className="text-center">
                <button className="btn btn-primary" onClick={() => navigate("/")}>
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
