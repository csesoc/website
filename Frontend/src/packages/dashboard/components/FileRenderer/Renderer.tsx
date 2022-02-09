import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux-state/reducers';
import { folderSelectors } from '../../state/folders/index';
import FileContainer from './FileContainer';
import FolderContainer from './FolderContainer';

export default function Renderer(){
  const folders = useSelector((state: RootState) => (
    folderSelectors.getFolderState(state)
  ));

  console.log(folders)

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
            />
          )
        default:
          return;
      }
      // else filecontainer
    })
  )
  return (
    <div>
      {renderItems()}
    </div>
  )
}

