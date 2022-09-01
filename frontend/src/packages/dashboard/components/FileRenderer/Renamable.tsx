// Renamable text field
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// A component that can be double-clicked and edited

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { RenamePayloadType, renameFileEntityAction } from "src/packages/dashboard/state/folders/actions";

interface Props {
  name: string,
  id: number,
}

export default function Renamable({ name, id }: Props) {
  const [toggle, setToggle] = useState(true);
  const [inputName, setInputName] = useState(name);

  const dispatch = useDispatch();

  const handleRename = (newName: string) => {
    const newPayload: RenamePayloadType = { id, newName }
    dispatch(renameFileEntityAction(newPayload))
  }

  return (
    <>
      {toggle ? (
        <div
          onDoubleClick={() => setToggle(false)}>
          {name}
        </div>
      ) : (
        <input
          style={
            {
              textAlign: "center",
              width: "6vw"
            }
          }
          type="text"
          value={inputName}
          onChange={event => setInputName(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === "Escape") {
              if (event.key === "Enter") {
                handleRename(inputName);
              }
              setToggle(true);
              event.preventDefault();
              event.stopPropagation();
            }
          }} />
      )}
    </>
  )
}