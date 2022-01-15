// Renamable text field
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// A component that can be double-clicked and edited

import React, { useState } from "react";

interface Props {
  name: string,
  onRename: (newName: string) => void
}

export default function Renamable ({ name, onRename }: Props) {
  const [toggle, setToggle] = useState(true);
  const [inputName, setInputName] = useState(name);

  return (
    <>
      {toggle ? (
        <p
          onDoubleClick={() => setToggle(false)}>
          {name}
        </p>
      ) : (
        <input
          type="text"
          value={inputName}
          onChange={event => setInputName(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === "Escape") {
              if (event.key === "Enter") {
                onRename(inputName);
              }
              setToggle(true);
              event.preventDefault();
              event.stopPropagation();
            }
          }} />
      )}
    </>
  );
};