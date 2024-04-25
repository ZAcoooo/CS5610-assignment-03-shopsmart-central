import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Access Token</h5>
              <pre className="card-text">{JSON.stringify(accessToken, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5">
      <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">User Info</h5>
              <pre className="card-text">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
