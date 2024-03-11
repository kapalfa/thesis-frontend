import { useState, createContext } from 'react'
import React from 'react'
import ControlledTreeView from './ControlledTreeView.jsx'
import { useLocation } from 'react-router-dom'
import CodeEditor from './CodeEditor.jsx'
import ReadonlyCodeEditor from './ReadonlyCodeEditor.jsx'
import ReadonlyChat from './ReadonlyChat.jsx'
import Info from './Info.jsx'
import Chat from './Chat.jsx'
export const FileContext = createContext();

export default function BasicGrid(){
  const [selectedFile, setSelectedFile] = useState(null)
  const location = useLocation()
  const readonly = location.state?.public

  return (
    <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
      <div style={{display: 'flex', height: '100vh',  overflowX:'hidden'}}>
        <div style={{flex: '0 0 20%', display:'flex', flexDirection:'column', borderRight: '1px solid black'}}>
          <ControlledTreeView readonly={readonly} />
          <div style={{margin:10}}>
            <Info />
          </div>
        </div>   
        <div style={{ flex: '0 0 50%'}}>
          {!readonly && <CodeEditor />}
          {readonly && <ReadonlyCodeEditor />}
        </div>      
        <div style={{flex: '0 0 30%', display: 'flex', flexDirection: 'column'}} >
          {!readonly && <Chat/>}
          {readonly && <ReadonlyChat/>}  
        </div>
      </div>
    </FileContext.Provider>  
  );
}