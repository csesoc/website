// Renamable text field
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// A component that can be double-clicked and edited

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  RenamePayloadType,
  renameFileEntityAction,
} from "src/packages/dashboard/state/folders/actions";

interface Props {
  name: string;
  id: string;
}

export default function Renamable({ name, id }: Props) {
  const [toggle, setToggle] = useState(true);
  const [inputName, setInputName] = useState<string>(name);

  const dispatch = useDispatch();

  const handleRename = (newName: string) => {
    const newPayload: RenamePayloadType = { id, newName };
    dispatch(renameFileEntityAction(newPayload));
  };

 
  return (
    <>
      {toggle ? (
        <div onDoubleClick={() => {
          setToggle(false);
          // required as browser doesn't update inputName
          // after first refresh of page after renaming
          setInputName(name); 
        }}>{name}</div>
      ) : (
        <input
          style={{
            textAlign: "center",
            width: "6vw",
          }}
          type="text"
          value={inputName}
          onChange={(event) => setInputName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              if (event.key === "Enter") {
                handleRename(inputName);
              }
              setToggle(true);
              event.preventDefault();
              event.stopPropagation();
            }
          }}

          onBlur={(event) => {
              handleRename(inputName);
              setToggle(true);
              event.preventDefault();
              event.stopPropagation();
          }}
        autoFocus
        />
      )}
    </>
  );
}
