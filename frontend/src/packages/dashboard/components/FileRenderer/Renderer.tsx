import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux-state/reducers';
import { folderSelectors } from '../../state/folders/index';
import FileContainer from './FileContainer';
import FolderContainer from './FolderContainer';
import { FileEntity } from '../../state/folders/types';

type Props = {
  selectedFile: string | null;
  setSelectedFile: (id: string) => void;
};

export default function Renderer({ selectedFile, setSelectedFile }: Props) {
  const folders = useSelector((state: RootState) =>
    folderSelectors.getFolderState(state)
  );

  const folderItems = folders.items;

  // folderItems

  const fileComparator = (a : FileEntity, b : FileEntity) => {
    if (a.type === b.type) {
      return (
        a.name.toLowerCase() < b.name.toLowerCase() 
        ? -1
        : ( a.name.toLowerCase() > b.name.toLowerCase() 
            ? 1 
            : 0
          )
        );
    } else if (a.type === "File") {
      return 1
    }
    return -1;
  };

  const renderItems = () => 

  [...folderItems]
  .sort(fileComparator)
  .map((item, index) => {
      switch (item.type) {
        case 'Folder':
          return (
            <FolderContainer
              key={index}
              id={item.id}
              name={item.name}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          );
        case 'File':
          return (
            <FileContainer
              key={index}
              id={item.id}
              name={item.name}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          );
        default:
          return;
      }
    });
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {renderItems()}
    </div>
  );
}
