import styled from "styled-components";
import { createEditor, Editor, Element, Transforms} from "slate";
import React, { FC, useMemo, useCallback, useRef, useState, useEffect } from "react";
import { Slate, Editable, withReact,  RenderLeafProps } from "slate-react";

import { CMSBlockProps } from "../types";
import EditorSelectFont from './buttons/EditorSelectFont'
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import MediaContentBlockWrapper from "../../../cse-ui-kit/mediablock/mediacontentblock-wrapper";
import MediaContentBlock from "src/cse-ui-kit/MediaContentBlock/MediaContentBlock";

import { CustomElement } from '../types';
import { getImage, publishImage } from "../api/cmsFS/volumes";



/**
 * (Adopted from 22T3 COMP6080 Ass3 Starter code hehe)
 * 
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl (file : File) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}


const defaultTextSize = 24;

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 660px;
  margin: 5px;
`;

const InputFile = styled.input`
  display: none;
`

const Text = styled.span<{
  textSize: number;
}>`
  font-size: ${(props) => (props.textSize)}px;
`;

/* Notes
  All non empty media blocks should store the address of the corresponding media on the BE
  - (storing base64 on FE is simply too exxy)
  Should each node have a `src` or `url` key which stores this address
  - If empty, should display the placeholder upload node
  - else, a request to the BE should be made to fetch the corresponding image/media
    - This will be in its raw base64 form

  TODO
  - Create function for handling non empty media blocks
    - GET request to BE to fetch corresponding image 
    - website/backend/endpoints/registration.go Ln 15 for reference
  - Define a robust schema for how urls or src's will be stored on FE for non empty blocks
  - To `uploadMedia`, add code to upload the image to the BE
    
  
  https://csesoc.atlassian.net/browse/WEB-29 

*/

const MediaBlock: FC<CMSBlockProps> = ({
  id,
  update,
  showToolBar,
  initialValue,
  onEditorClick,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // Fetch id of media in BE (if it exists)
  const mediaSrc = (editor.children[0] as Element) !== undefined
  ? (editor.children[0] as Element).mediaSrc ?? ""
  : ""

  const [media, setMedia] = useState<string | null>(null);

  const renderLeaf: (props: RenderLeafProps) => JSX.Element = useCallback(
    ({ attributes, children, leaf }) => {
      return (
        <Text 
          textSize={leaf.textSize ?? defaultTextSize} 
          {...attributes}
        >
          {children}
        </Text>
      );
    },
    []
  );

  useEffect(() => {
    if (mediaSrc !== "") {
      const image = getImage(mediaSrc)
      setMedia(image as unknown as string);
    }
  }, [])
  
  const uploadMedia = async (rawMedia : File) => {
    let convertedMedia : string | ArrayBuffer | null;
    try {
      // converts to base64 i think
      convertedMedia = await fileToDataUrl(rawMedia);
    } catch (err) {
      alert(err);
      return;
    }

    if (!(convertedMedia instanceof ArrayBuffer)) {
      setMedia(convertedMedia);
      if (convertedMedia) {
        // TODO: pretty sure i should pass the document id, not just the block id
        // TODO: Figure out how to propagate the document id to this level :S
        const newUploadId = await publishImage(`${id}`, convertedMedia)

        Transforms.select(editor, {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        })
        Transforms.setNodes(editor, { mediaSrc: newUploadId });
      }
    }
  }

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => { update(id, editor.children, editor.operations); }}
    >
      <MediaContentBlockWrapper focused={showToolBar}>
        {/* <Editable
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: "100%", height: "100%" }}
          onKeyDown={(event) => handleKey(event, editor)}
          autoFocus
        /> */}
          {/* <MediaContentBlock onClick={() => onEditorClick()}> */}
          { mediaSrc === "" ?
            <>
              <MediaContentBlock onClick={() => {
                hiddenFileInput.current?.click();
                onEditorClick();
              }}>
              </MediaContentBlock>
              <InputFile 
                type="file" 
                ref={hiddenFileInput}
                onChange={event => event.target.files && uploadMedia(event.target.files[0])}
              /> 
            </>
          :
            <img src={media ?? ""} alt="" />
        }
      </MediaContentBlockWrapper>
    </Slate>
  );
};

export default MediaBlock;
