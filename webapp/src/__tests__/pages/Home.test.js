import React from "react";
import { render } from "@testing-library/react";
import Home from "../pages/Home";

describe("Home Component", () => {
    it("renders without error", () => {
        render(<Home />);
    });

    it("displays the correct title", () => {
        const { getByText } = render(<Home />);
        const titleElement = getByText("Welcome to the Home Page");
        expect(titleElement).toBeInTheDocument();
    });

    it("applies the correct theme", () => {
        const { container } = render(<Home />);
        const homeContainer = container.firstChild;
        expect(homeContainer).toHaveStyle("background-color: #f0f0f0");
    });
});
