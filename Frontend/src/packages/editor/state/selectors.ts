import { useSelector } from "react-redux";
import { RootState } from "../../../redux-state/reducers";
import { BlockInfo } from "./types";

export function getContents(): BlockInfo[] {
  return useSelector((state: RootState) => state.editor.contents)
}