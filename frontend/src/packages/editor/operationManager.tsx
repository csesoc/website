// operationManager is a centralized location for dealing with captured operations from anywhere within the editor
//  these operations are shoved along and propagated to the server :)

import { BaseOperation, InsertTextOperation, NodeOperation, RemoveTextOperation, TextOperation } from "slate";
import { CMSOperation } from "./api/OTClient/operation";
import { BlockData, CMSEditorNode, CustomElement, CustomText, IsCustomElement, IsCustomTextBlock } from "./types";

export class OperationManager {
    public pushToServer = (operation: CMSOperation) => {
        // todo: reformat the operation to follow the structure of a CMS operation
        //  drawing upon the editor content as a relative data source

        // todo: remove console.logs after completion
        // console.log("operation: ", operation);
    }
}

export const slateToCmsOperation = (editorContent: BlockData, operation: BaseOperation[]) : CMSOperation => {
    // TODO: remove console.logs after full completion :D
    console.log("content: ", editorContent);
    console.log("operation: ", operation);

    // TODO: implement me :D
    return {
        Path: [1, 2, 3],
        OperationType: "insert",
        IsNoOp: false,
        Operation: {
            $type: "noop",
            noop: {}
        }
    }
}


/** 
 * The semantics of Slate Operations
 *      - Slate models operations somewhat weirdly, theres a few key types
 *          - Insert/Remove text modifies the text field so the "path" isn't actually a complete path in the traditional OT sense 
 *          - Set-node modifies a specific field
 *          - Paths like [a, b, c] refer to indexes in either array elements or children fields
*/

// normalizePath extends the path in a slate operation to also include the field it is editing
// for example: if we receive the slate operation {set-node underline = true of text-object} with the path [0, 0, 0]
// the normalised path will be [0, 0, 0, 4] (assuming 4 is index 4 in the text object)
const normalizePath = (editorContent: BlockData, op: NodeOperation | TextOperation): number[] => {
    // quirkiness with the CMS text operation interface, the target is included in the path
    if (op.type === "remove_text" || op.type === "insert_text") {
        return op.path;
    }

    // resolve what type we're studying and fetch the field mappings for it
    return [];
}

const convertTextInsertionOp = (editorContent: BlockData, op: InsertTextOperation): CMSOperation => (
    {
        Path: op.path,
        OperationType: "insert",
        IsNoOp: false,
        Operation: {
            $type: "stringOperation",
            stringOperation: {
                rangeStart: op.offset,
                rangeEnd: op.offset + op.text.length,
                newValue: op.text,
            },
        },
    }
);


const convertTextRemovalOp = (editorContent: BlockData, op: RemoveTextOperation): CMSOperation => (
    {
        Path: op.path,
        OperationType: "delete",
        IsNoOp: false,
        Operation: {
            $type: "stringOperation",
            stringOperation: {
                rangeStart: op.offset - op.text.length,
                rangeEnd: op.offset,
                newValue: op.text,
            },
        },
    }
);


const normalizeElementPath = (contentBlock: CMSEditorNode, op: NodeOperation | TextOperation): number[] => {
    if (IsCustomElement(contentBlock)) return normalizeCustomElementPath(contentBlock as CustomElement, op);
    if (IsCustomTextBlock(contentBlock)) return normalizeCustomTextPath(contentBlock as CustomText, op);

    return [];
}

const normalizeCustomElementPath = (contentBlock: CustomElement, op: NodeOperation | TextOperation): number[] => {
    return [] 
}

const normalizeCustomTextPath = (contentBlock: CustomText, op: NodeOperation | TextOperation): number[] => {
    // TODO: For Mae :P - So the issue here is that fields on javascript objects are unordered, this is unlike Go where (typically) the order in which
    // u lay them out is their actual order (assuming the compiler doesn't perform any struct packing optimizations, which it doesn't look like it does: https://github.com/golang/go/issues/10014)
    // so this means at runtime we know the order of fields in our Go struct but not our TS struct, thus when we construct the JSON ast from the TS JSON data we are guaranteed that it conforms to the order
    // in which they appear in Go structs.
    
    // The issue however is that when we get a slate operation we need to (magically) map that to a numerical value indicating the position in the Go struct/ast, for now we will just maintain a hard coded association
    // that needs to be synchronised with: https://github.com/csesoc/website/tree/main/backend/editor/OT/data/datamodels/cmsmodel but in the future we really should try and come up with a better solution
    // perhaps thats ur first task as backend lead :P
    // direct mapping of: https://github.com/csesoc/website/blob/main/backend/editor/OT/data/datamodels/cmsmodel/paragraph.go#L18
    const fieldIndexes = {
        "text": 0,
        "link": 1,
        "bold": 2,
        "italic": 3,
        "underline": 4
    }

    const isTextOp = op.type === "insert_text" || op.type === "remove_text";
    const finalIndex = isTextOp
                        ? fieldIndexes.text
                        :

}