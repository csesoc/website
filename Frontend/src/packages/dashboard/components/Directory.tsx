import {Breadcrumbs, Link} from "@mui/material";
import React from "react";
import { useDispatch } from 'react-redux';

import {traverseBackFolder} from "../state/folders/actions";
import {getFolderState} from "../api/helpers";


export default function Directory() {
  const dispatch = useDispatch();
  const parentFolder = getFolderState().parentFolder;

  const handleClick = () => {
    dispatch(traverseBackFolder(parentFolder));
  };

  return (
    <div>
      <button onClick={ () => handleClick()}>go back</button>
      <Breadcrumbs aria-label="breadcrumb">
        {
          getFolderState().path.split("/").map((folder, i) => {
            return (
              <Link underline="hover" color="inherit" key={i}>
                {folder}
              </Link>
            )
          })
        }
      </Breadcrumbs>
    </div>
  )
}