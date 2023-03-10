import React from "react";
import { Breadcrumbs } from "@mui/material";
import Chip from "@mui/material/Chip";
import { emphasize, styled as customStyle } from "@mui/material/styles";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  traverseBackFolder,
  traverseIntoFolder,
} from "../state/folders/actions";
import { getFolderState } from "../api/helpers";
import { setDirectory } from "../state/folders/reducers";

const DirectoryFlex = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  margin: 10px 20px;
  height: fit-content;
`;

const BreadcrumbItem = customStyle(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[200]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
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

  const folderState = getFolderState();

  const handleClickBreadcrumbItem = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    dispatch(traverseIntoFolder("3f4b7ac5-2b08-43fe-87cd-4dd1d1be8455"));
    console.log("getFolderState", folderState);
  };

  return (
    <DirectoryFlex>
      <IconButton aria-label="back" onClick={() => handleClick()}>
        <ArrowBackIcon fontSize="inherit" />
      </IconButton>
      <Breadcrumbs aria-label="breadcrumb">
        {getFolderState()
          .path.split("/")
          .map((folder, i) => {
            return (
              <BreadcrumbItem
                key={i}
                label={folder}
                onClick={handleClickBreadcrumbItem}
              />
            );
          })}
      </Breadcrumbs>
    </DirectoryFlex>
  );
}
