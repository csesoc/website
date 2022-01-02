import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux-state/reducers';
import { folderSelectors } from '../../state/folders/index';
import FileContainer from './FileContainer';
import FolderContainer from './FolderContainer';

type Props = {
  
};

export default function Renderer({}: Props){
  const folders = useSelector((state: RootState) => (
    folderSelectors.getFolderState(state)
  ));

  const folderItems = folders.items;
  
  const renderItems = () => (
    folderItems.map((item) => {
      console.log('hi')
      return (
        <FolderContainer name={item.name}/>
      )
      // else filecontainer
    })
  )
  return (
    <div>
      {renderItems()}
    </div>
  )
}

