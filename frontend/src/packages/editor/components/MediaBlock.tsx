import styled from "styled-components";
import { BaseEditor, createEditor } from "slate";
import React, { FC, useMemo, useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Descendant } from "slate";
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

// const insertImage = (editor: BaseEditor & ReactEditor, src: string) => {
//   console.log("hello")
//   const image: { type: "image"; url: string } = {
//     type: 'image',
//     url: src,
//   }
//   console.log("trying")
//   console.log(editor.children)
//   Transforms.insertNodes(editor, image);
//   console.log("works")
//   console.log(editor.children)
// }



let addedImage = false
let imageurl = ''
const MediaBlock: FC<MediaBlockProps> = ({
  id,
  update,
  showToolBar,
  onMediaClick,
}) => {
  const editor = useMemo(() => withImages(withReact(createEditor())), []);
  const initialValue = getBlockContent(id);
  const dispatch = useDispatch();

  // const renderElement: (props: RenderElementProps) => JSX.Element = useCallback(
  //   ({ attributes, children, element }) => {
  //     switch (element.type) {
  //       case 'image':
  //         return (
  //           <div
  //             {...attributes}
  //           >
  //             <div contentEditable={false}>
  //               <img src={imageurl} />
  //             </div>
  //             {children}
  //           </div>
  //         );
  //       default:
  //         return <p {...attributes}>{children}</p>
  //     }
  //   }, []);
  const onDrop = useCallback(acceptedFiles => {
    const f: FileWithPath = acceptedFiles[0]
    console.log(f.path)
    addedImage = true
    if (f.path) {
      imageurl = f.path
      const value: Descendant[] = [
        {
          type: "image",
          url: f.path,
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
  return (
    <ContentBlockWrapper focused={showToolBar} onClick={onMediaClick}>
      <div>
        {addedImage ?
          <div className="file-item">
            <img
              alt={`img - ${imageurl}`}
              src={imageurl}
              className="file-img"
            />
          </div>
          :
          <div {...getRootProps({ className: "dropzone" })}>
            <input type="file" className="input-zone" {...getInputProps()} />
            {isDragActive ? (
              <ContentBlock
                textContent="Release to drop the files here"
              />
            ) : (
              <ContentBlock
                textContent="Upload Images/Gifs"
              />
            )}
          </div>
        }
      </div>
    </ContentBlockWrapper>
  )
};

export default MediaBlock;
