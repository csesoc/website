import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux-state/reducers';
import { folderSelectors } from '../../state/folders/index';
import FileContainer from './FileContainer';
import FolderContainer from './FolderContainer';
import {
  DeletePayloadType,
  deleteFileEntityAction,
} from '../../state/folders/actions';

type Props = {
  selectedFile: string | null;
  setSelectedFile: (id: string) => void;
};

export default function Renderer({ selectedFile, setSelectedFile }: Props) {
  const folders = useSelector((state: RootState) =>
    folderSelectors.getFolderState(state)
  );

  const folderItems = folders.items;

  const dispatch = useDispatch();

  const handleDeleteKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Delete' && selectedFile !== null) {
      const folderPayload: DeletePayloadType = {
        id: selectedFile,
      };
      dispatch(deleteFileEntityAction(folderPayload));
    }
  };

  const renderItems = () =>
    folderItems.map((item, index) => {
      switch (item.type) {
        case 'Folder':
          return (
            <FolderContainer
              key={index}
              id={item.id}
              name={item.name}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              handleDeleteKeyDown={handleDeleteKeyDown}
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
              handleDeleteKeyDown={handleDeleteKeyDown}
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
