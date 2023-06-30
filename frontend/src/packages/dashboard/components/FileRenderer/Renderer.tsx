import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux-state/reducers';
import { folderSelectors } from '../../state/folders/index';
import FileContainer from './FileContainer';
import FolderContainer from './FolderContainer';

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

  const renderItems = () =>
  [...folderItems]
  .sort((a, b) => (a.name < b.name ? -1: ( a.name > b.name ? 1 : 0)))
  .map((item, index) => {
      console.log(item.name)
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
  console.log(" ");
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
