import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const { user } = useAuth0();
  const [userData, setUserData] = useState(null);
  const { accessToken } = useAuthToken();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          setShippingAddress(userData.shippingAddress || "");
          setPhoneNumber(userData.phoneNumber || "");
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [accessToken]);

  const handleShippingAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value;
    if (/^[0-9]*$/.test(inputValue) && inputValue.length <= 10) {
      setPhoneNumber(inputValue);
    }
  };

  const handleSaveChanges = async () => {
    if (phoneNumber.length !== 10) {
        alert("Please enter a 10-digit phone number.");
        return;
      }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          shippingAddress: shippingAddress,
          phoneNumber: phoneNumber,
        }),
      });
      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Profile</h2>
              <div className="text-center">
                {/* Display user information */}
                <p className="lead">Name: {userData.name}</p>
                <p className="lead">📧 Email: {userData.email}</p>
                <p className="lead">🔑 Auth0Id: {userData.auth0Id}</p>
                <p className="lead">
                  ✅ Email verified: {user.email_verified?.toString()}
                </p>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label htmlFor="shippingAddress" className="form-label">
                      Shipping Address:
                    </label>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control"
                      id="shippingAddress"
                      value={shippingAddress}
                      onChange={handleShippingAddressChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number:
                    </label>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      pattern="[0-9]{10}"
                      title="Please enter a 10-digit phone number"
                      maxLength={10}
                    />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
