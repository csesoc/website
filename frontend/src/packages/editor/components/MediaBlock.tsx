import styled from "styled-components";
import { BaseEditor, createEditor, Transforms } from "slate";
import React, { FC, useMemo, useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Descendant, Editor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  ReactEditor,
  RenderElementProps,
} from "slate-react";

import { BlockData, UpdateHandler } from "../types";

import ContentBlock from "../../../cse-ui-kit/MediaContentBlock/MediaContentBlock";
import ContentBlockWrapper from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { toggleMark, handleKey } from "./buttons/buttonHelpers";
import { getBlockContent } from "../state/helpers";

// Redux
import { useDispatch } from "react-redux";
import { updateContent } from "../state/actions";
import { StringDecoder } from "string_decoder";

interface MediaBlockProps {
  update: UpdateHandler;
  initialValue: BlockData;
  id: number;
  showToolBar: boolean;
  onMediaClick: () => void;
}

const withImages = (editor: BaseEditor & ReactEditor) => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return element.type === "image" ? true : isVoid(element)
  }

  return editor
}

const insertImage = (editor: BaseEditor & ReactEditor, src: string) => {
  const image: { type: "image"; url: string; children: [{ text: "" }] } = {
    type: 'image',
    url: src,
    children: [{ text: "" }],
  }
  console.log("trying")
  Transforms.select(editor, {
    anchor: Editor.start(editor, []),
    focus: Editor.end(editor, []),
  })
  Transforms.removeNodes(editor);
  Transforms.insertNodes(editor, image, { select: true });
  console.log("works")
  console.log(editor.children)
}

let addedImage = false
const MediaBlock: FC<MediaBlockProps> = ({
  id,
  update,
  initialValue,
  showToolBar,
  onMediaClick,
}) => {
  const editor = useMemo(() => withImages(withReact(createEditor())), []);
  console.log("initialValue: ")
  console.log(initialValue)
  const dispatch = useDispatch();

  const renderElement: (props: RenderElementProps) => JSX.Element = useCallback(
    ({ attributes, children, element }) => {
      console.log("rendering:")
      console.log(element.type)
      switch (element.type) {
        case 'image':
          return (
            <div
              {...attributes}
            >
              <div contentEditable={false}>
                <img src={element.url} />
              </div>
              {children}
            </div>
          );
        default:
          return <p {...attributes}>{children}</p>
      }
    }, []);
  const onDrop = useCallback(acceptedFiles => {
    const f: FileWithPath = acceptedFiles[0]
    console.log(f.path)
    addedImage = true
    if (f.path) {
      const value: Descendant[] = [
        {
          type: "image",
          url: f.path,
          children: [{ text: "" }]
        },
      ];
      console.log("sigh")
      update(id, value);
      console.log("children: ")
      console.log(editor.children)
      console.log("sigh")
      console.log("children: ")
      console.log(editor.children)
      dispatch(
        updateContent({
          id: id,
          data: value,
        })
      );
    }
    console.log("hello?")
  }, [])
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop });
  const handleInsertImage = () => {
    const url = prompt("Enter an Image URL");
    if (url) {
      insertImage(editor, url);
    }
  };
  return (
    <ContentBlockWrapper focused={showToolBar} onClick={onMediaClick}>
      <Slate editor={editor} value={initialValue} onChange={(value) => {
        update(id, editor.children);

        dispatch(
          updateContent({
            id: id,
            data: value,
          })
        );
      }}>
        <button onClick={handleInsertImage}></button>
        <Editable renderElement={renderElement} contentEditable={false} />
      </Slate>
    </ContentBlockWrapper>
  )
};
// <div>
//   {addedImage ?
//     <div {...getRootProps({ className: "dropzone" })}>
//       <input type="file" className="input-zone" {...getInputProps()} />
//       {isDragActive ? (
//         <ContentBlock
//           textContent="Release to drop the files here"
//         />
//       ) : (
//         <ContentBlock
//           textContent="Upload Images/Gifs"
//         />
//       )}
//     </div>
//   }
// </div>

export default MediaBlock;
