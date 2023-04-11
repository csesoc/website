import { render } from "src/cse-testing-lib";
import { queryByDataAnchor } from "src/cse-testing-lib/custom-queries";
import SideBar from "./SideBar";
import React from "react";

describe("Side bar tests", () => {
  it("Side bar is rendered with proper buttons", () => {
    const mockSetOpen = jest.fn();

    const mockSetModalState = jest.fn();
    const mockSelectedFileID = "5";
    const { queryByDataAnchor } = render(
        <SideBar
          setModalState={mockSetModalState}
          selectedFile={mockSelectedFileID}
          isOpen={true}
          setOpen={mockSetOpen}
        />
    );

    expect(queryByDataAnchor("NewPageButton")).toBeTruthy();
    expect(queryByDataAnchor("NewFolderButton")).toBeTruthy();
  });
});
