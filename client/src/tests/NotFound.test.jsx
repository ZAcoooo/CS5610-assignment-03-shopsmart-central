import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "../components/NotFound";

describe("NotFound Component", () => {
  test("displays the correct text", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    expect(screen.getByText("404 - Not Found")).toBeInTheDocument();
  });
});
