import styled from "styled-components";
import { createEditor } from "slate";
import React, { FC, useMemo, useCallback, useRef, useState } from "react";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import { CMSBlockProps } from "../types";
import EditorSelectFont from './buttons/EditorSelectFont'
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import MediaContentBlockWrapper from "../../../cse-ui-kit/mediablock/mediacontentblock-wrapper";
import MediaContentBlock from "src/cse-ui-kit/MediaContentBlock/MediaContentBlock";


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


const MediaBlock: FC<CMSBlockProps> = ({
  id,
  update,
  showToolBar,
  initialValue,
  onEditorClick,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

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

  const uploadMedia = async (rawMedia : File) => {
    let convertedMedia : string | ArrayBuffer | null;
    try {
      // converts to base64 i think
      convertedMedia = await fileToDataUrl(rawMedia);
    } catch (err) {
      alert(err);
      return;
    }

    if (!(convertedMedia instanceof ArrayBuffer)) 
      setMedia(convertedMedia);

    // TODO - upload image to docker store

  }

  /*
    Planning
    - Have a ternary op to decide whether to display the editor or placeholder graphic
    - REMINDER - need to support urls AND uploading to the backend
      - The former seems a little less complicated ;)
    - Get clarification on how backend to store and retrieve images
      - Does the getPublishedDoc endpoint contain a url to the image source in BE, or is it the
        actual image itself??
        - update: it's the base64 bits
  */

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
          { !media ?
            <>
              <MediaContentBlock onClick={() => {
                console.log("hi")
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
