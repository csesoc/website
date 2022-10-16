import { render } from "src/cse-testing-lib";
import { queryByDataAnchor } from "src/cse-testing-lib/custom-queries";
import SideBar from "./SideBar";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";

describe("Side bar tests", () => {
  it("Side bar is rendered with proper buttons", () => {
    const mockSetOpen = jest.fn();

    const mockSetModalState = jest.fn();
    const mockSelectedFileID = "5";
    const { queryByDataAnchor } = render(
      <Router>
        <SideBar
          setModalState={mockSetModalState}
          selectedFile={mockSelectedFileID}
          isOpen={true}
          setOpen={mockSetOpen}
        />
      </Router>
    );

    expect(queryByDataAnchor("NewPageButton")).toBeTruthy();
    expect(queryByDataAnchor("NewFolderButton")).toBeTruthy();
  });
});
