import React from "react";
import { Breadcrumbs } from "@mui/material";
import Chip from '@mui/material/Chip';
import { emphasize, styled as customStyle } from '@mui/material/styles';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { traverseBackFolder } from "../state/folders/actions";
import { getFolderState } from "../api/helpers";


const DirectoryFlex = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  margin: 10px 20px;
  height: fit-content;
`

const BreadcrumbItem = customStyle(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});


export default function Directory() {
  const dispatch = useDispatch();
  const parentFolder = getFolderState().parentFolder;

  const handleClick = () => {
    dispatch(traverseBackFolder(parentFolder));
  };

  return (
    <DirectoryFlex>
      <button onClick={ () => handleClick()}>go back</button>
      <Breadcrumbs aria-label="breadcrumb">
        {
          getFolderState().path.split("/").map((folder, i) => {
            return (
              <BreadcrumbItem
                key={i}
                label={folder}
              />
            )
          })
        }
      </Breadcrumbs>
    </DirectoryFlex>
  )
}