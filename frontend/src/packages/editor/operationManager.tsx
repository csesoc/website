// operationManager is a centralized location for dealing with captured operations from anywhere within the editor
//  these operations are shoved along and propagated to the server :)

import { BaseOperation } from "slate";
import { CMSOperation } from "./api/OTClient/operation";
import { BlockData } from "./types";

export class OperationManager {
    public pushToServer = (operation: CMSOperation) => {
        // todo: reformat the operation to follow the structure of a CMS operation
        //  drawing upon the editor content as a relative data source

        // todo: remove console.logs after completion
        console.log("operation: ", operation);
    }
}

export const slateToCmsOperation = (editorContent: BlockData, operation: BaseOperation[]) : CMSOperation => {
    // TODO: remove console.logs after full completion :D
    // console.log("content: ", editorContent);
    // console.log("operation: ", operation);

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