import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux-state/reducers';
import { folderSelectors } from '../../state/folders/index';
import FileContainer from './FileContainer';
import FolderContainer from './FolderContainer';

type Props = {
  selectedFile: number | null;
  setSelectedFile: (id: number) => void;
}

export default function Renderer({ selectedFile, setSelectedFile }: Props){
  const folders = useSelector((state: RootState) => (
    folderSelectors.getFolderState(state)
  ));

  const folderItems = folders.items;
  
  const renderItems = () => (
    folderItems.map((item, index) => {
      switch(item.type) {
        case "Folder":
          return (
            <FolderContainer 
              key={index}
              id={item.id}
              name={item.name}
            />
          )
        case "File":
          return (
            <FileContainer
              key={index}
              id={item.id}
              name={item.name}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          )
        default:
          return;
      }
    })
  )
  return (
    <div style={{
      display: "flex",
    }}>
      {renderItems()}
    </div>
  )
}

