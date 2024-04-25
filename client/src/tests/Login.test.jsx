import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  const mockLoginWithRedirect = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    mockLoginWithRedirect.mockClear();
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders without crashing", () => {
    render(<Login />);
    expect(screen.getByText("Shopsmart Central App")).toBeInTheDocument();
  });

  test("displays Login button when not authenticated", () => {
    render(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Go Back to Home")).toBeInTheDocument();
  });

  test("displays Enter App button when authenticated", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Login />);
    expect(screen.getByText("Enter App")).toBeInTheDocument();
    expect(screen.getByText("Go Back to Home")).toBeInTheDocument();
  });

  test("Login button triggers loginWithRedirect", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("Login"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  test("Enter App button triggers navigation", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Login />);
    fireEvent.click(screen.getByText("Enter App"));
    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });

  test("Signup button triggers loginWithRedirect with correct parameters", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("Sign Up"));
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  });
});
