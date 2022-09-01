import { render } from "src/cse-testing-lib"
import { queryByDataAnchor } from "src/cse-testing-lib/custom-queries";
import SideBar from "./SideBar"
import { BrowserRouter as Router} from "react-router-dom";
import { useState } from 'react'


describe("Side bar tests", () => {
  it("Side bar is rendered with proper buttons", () => {
  const [isOpen, setOpen] = useState(true)

    const mockSetModalState = jest.fn();
    const mockSelectedFileID = 5;
    const { queryByDataAnchor } = render(
      <Router>
        <SideBar 
          setModalState={mockSetModalState}
          selectedFile={mockSelectedFileID}
          isOpen={isOpen}
          setOpen={setOpen}
        />
      </Router>
    )
    
    expect(queryByDataAnchor("NewPageButton")).toBeTruthy();
    expect(queryByDataAnchor("NewFolderButton")).toBeTruthy();
  })
})