import { render, fireEvent } from "src/cse-testing-lib"
// import { queryByDataAnchor } from "src/cse-testing-lib/custom-queries";
// import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import EditorPage from "./index";
import { BrowserRouter as Router } from "react-router-dom";

describe("Editor Block tests", () => {
  it("On CreateContentBlockButton click should create content block", () => {
    const { queryByDataAnchor, queryAllByDataAnchor } = render(
      <Router>
        <EditorPage/>
      </Router>
    );
    const CreateContentBlockButton = queryByDataAnchor("CreateContentBlockButton");

    if(CreateContentBlockButton) {
      fireEvent.click(CreateContentBlockButton);
      // expects there to be 1 Content block rendered
      const ContentBlock = queryAllByDataAnchor("ContentBlockWrapper");
      // content block wrapper exists
      expect(ContentBlock).toBeTruthy();
      // assert there is only 1 content block wrapper
      expect(ContentBlock).toHaveLength(1);
    }
    
  })
  it("clicking CreateContentBlock Button 5 times should create 5 content block wrappers", () => {
    const { queryByDataAnchor, queryAllByDataAnchor } = render(
      <Router>
        <EditorPage/>
      </Router>
    );
    const CreateContentBlockButton = queryByDataAnchor("CreateContentBlockButton");

    if(CreateContentBlockButton) {
      for(let i = 0; i < 5; i++) {
        fireEvent.click(CreateContentBlockButton);
      }
      // expects there to be 1 Content block rendered
      const ContentBlock = queryAllByDataAnchor("ContentBlockWrapper");
      // content block wrapper exists
      expect(ContentBlock).toBeTruthy();
      // assert there is only 1 content block wrapper
      expect(ContentBlock).toHaveLength(5);
    }
    
  })
});