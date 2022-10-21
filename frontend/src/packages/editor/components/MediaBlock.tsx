import styled from "styled-components";
import { Transforms, BaseEditor, createEditor } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  ReactEditor,
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
    return element.type === "media" ? true : isVoid(element)
  }

  return editor
}

// const insertImage = (editor: BaseEditor & ReactEditor, src: string) => {
//   const image = ({
//     type: '"media"',
//     src,
//     children: [{ text: "" }],
//   })
//   // const image  = { type: 'image', src }
//   Transforms.insertNodes(editor, image);
// }

// const Element = (props: unknown) => {
//   const { attributes, children, element } = props

//   switch (element.type) {
//     case 'image':
//       return <Image {...props} />
//     default:
//       return <p {...attributes}>{children}</p>
//   }
// }

// const Image = ({ attributes, children, element }) => {
//   const editor = useSlateStatic()
//   const path = ReactEditor.findPath(editor, element)

//   const selected = useSelected()
//   const focused = useFocused()
//   return (
//     <div {...attributes}>
//       {children}
//       <div
//         contentEditable={false}
//         className={css`
//           position: relative;
//         `}
//       >
//         <img
//           src={element.url}
//           className={css`
//             display: block;
//             max-width: 100%;
//             max-height: 20em;
//             box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
//           `}
//         />
//         <Button
//           active
//           onClick={() => Transforms.removeNodes(editor, { at: path })}
//           className={css`
//             display: ${selected && focused ? 'inline' : 'none'};
//             position: absolute;
//             top: 0.5em;
//             left: 0.5em;
//             background-color: white;
//           `}
//         >
//           <Icon>delete</Icon>
//         </Button>
//       </div>
//     </div>
//   )
// }

// const InsertImageButton = () => {
//   const editor = useSlateStatic()
//   return (
//     <Button
//       onMouseDown={event => {
//         event.preventDefault()
//         const url = window.prompt('Enter the URL of the image:')
//         if (url && !isImageUrl(url)) {
//           alert('URL is not an image')
//           return
//         }
//         url && insertImage(editor, url)
//       }}
//     >
//       <Icon>image</Icon>
//     </Button>
//   )
// }

const popup = () => {
  return (
    <div>
      Hi
    </div>
  );
}

const MediaBlock: FC<MediaBlockProps> = ({
  id,
  update,
  showToolBar,
  onMediaClick,
}) => {
  const dispatch = useDispatch();
  const editor = useMemo(() => withImages(withReact(createEditor())), []);

  const initialValue = getBlockContent(id);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        update(id, editor.children);

        dispatch(
          updateContent({
            id: id,
            data: value,
          })
        );
      }}
    >
      <ContentBlockWrapper focused={showToolBar}>
        <ContentBlock
          onClick={() => {
            popup;
            onMediaClick();
          }}
        />
      </ContentBlockWrapper>
    </Slate>
  );
};

export default MediaBlock;
