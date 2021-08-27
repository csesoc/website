import React from 'react'
import SideBar from 'src/components/SideBar/SideBar';
import FileRenderer from 'src/components/FileRenderer/FileRenderer';


const dummy_files = [
  {
    filename : "file 1",
    type: "file"
  },
  {
    filename: "folder 1",
    type: "folder"
  },
  {
    filename: 'folder 2',
    type: 'folder'
  }
]


const Dashboard: React.FC = () => {
  // map function maps out all the objects
  // there is inline styling, use with caution

  return (
    <div style={{display: 'flex'}}>
      <SideBar/>
      {dummy_files.map((file)=> {
        return (
          <FileRenderer filename={file.filename} type={file.type} />
        )
      })}
    </div>
  )
}

export default Dashboard
