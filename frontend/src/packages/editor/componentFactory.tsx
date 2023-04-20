import { BaseOperation } from "slate";
import HeadingBlock from "./components/HeadingBlock";
import React from "react";
import { BlockData, UpdateCallback, CMSBlockProps } from "./types";
import EditorBlock from "./components/EditorBlock";
import { OperationManager, slateToCmsOperation } from "./operationManager";
import CodeBlock from "./components/CodeBlock";

// TODO: not now because I want to get this over and done with but the idea of attaching the operation path to the id irks me
//  because logically the operation paths aren't actually coupled to the id, it is just a coincidence, ideally the source of the operation path index
//  should come from elsewhere


type callbackHandler = (id: number, update: BlockData) => void;

// registration of all block constructors
const constructors: Record<string, (props: CMSBlockProps) => JSX.Element> = {
    "paragraph": (props) => <EditorBlock {...props} />,
    "heading": (props) => <HeadingBlock {...props} />,
    "code-block" : (props) => <CodeBlock {...props} />
}

/**
 * buildComponentFactory constructs a factory capable of creating CMS components
 * @param opManager the global operation manager
 * @param clickHandler the handler invoked when the element is clicked
 * @param updateHandler the handler invoked when teh contents is updated (note: will be deprecated after full transition to OT)
 */
export const buildComponentFactory = (opManager: OperationManager, onClick: (id: number) => void, onUpdate: UpdateCallback) => (block: BlockData, blockId: number, isFocused: boolean) : JSX.Element => {
    const componentProps = {
        id: blockId,
        key: blockId,
        showToolBar: isFocused,
        initialValue: block,
        update: buildUpdateHandler(blockId, opManager, onUpdate),
        onEditorClick: () => onClick(blockId),
    };

    const blockType = block[0].type ?? "unknown";
    const constructor = constructors[blockType];
    if (constructor === undefined) {
        throw new Error(`unidentified block type: ${blockType}`)
    }

    return constructor(componentProps);
}

// buildUpdateHandler wraps any updates to a component as a nice formatted operation for propagation to the OT server, it then invokes the initial provided handler
// ie the function is just a decorator function :)
const buildUpdateHandler = (blockId: number, opManager: OperationManager, updateCallback: callbackHandler) => (id: number, editorContent: BlockData, operations: BaseOperation[]) => {
    updateCallback(id, editorContent);
    const modifiedOperations = operations.map(operation => {
        if (operation.type === "set_selection") { return operation; }
    
        const modifiedOp = {...operation};
        modifiedOp.path = [blockId].concat([...operation.path]);
        
        return modifiedOp;
    })

    opManager.pushToServer(slateToCmsOperation(editorContent, modifiedOperations));
}