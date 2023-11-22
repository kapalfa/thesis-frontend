import Editor from '@monaco-editor/react'
import { useContext, useEffect, useRef } from 'react'
import { FileContext } from './MainView'

export default function CodeEditor(){
    const editorRef = useRef('')
    const { selectedFile } = useContext(FileContext)
  
    useEffect(()=>{
      if(editorRef.current && selectedFile){
        const model = editorRef.current.getModel()
        model.setValue(selectedFile.content)
      } else if(editorRef.current){
          model.setValue('')
      }
    }, [selectedFile])
  
    function handleEditorDidMount(editor, monaco) {
      editorRef.current = editor;
    }
  
    return(
      <div> 
        <Editor
        height="100vh"
        theme="vs-dark"
        onMount={handleEditorDidMount}
      //  path = {file.file.name}
        value = {selectedFile ? selectedFile.content : ''}
        language = {selectedFile ? selectedFile.language : ''}
        />
      </div>
    )
  }