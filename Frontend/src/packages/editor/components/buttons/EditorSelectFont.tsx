import React from "react";
import { useSlate } from "slate-react";
import { Editor } from "slate";

const selectFont = () => {
    const editor = useSlate();

    return (
        <select name="fonts" id="fontDropdown" onChange={(event) => {
            Editor.addMark(editor, "textSize", event.currentTarget.value)
        }}>
            <option value="16">16</option>
            <option value="24">24</option>
            <option value="36">36</option>
            <option value="48">48</option>  
        </select>
    )
}

export default selectFont