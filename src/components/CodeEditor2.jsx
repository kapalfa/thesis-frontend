import { Editor } from '@monaco-editor/react'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FileContext } from './MainView'
import { diffLines, applyPatch, parsePatch, createPatch } from 'diff'
import getLanguage from '../../languageDetection/detectLang.js'
import axios from 'axios'
export default function CodeEditor(){
    const editorRef1 = useRef(null)
    const [content, setContent] = useState('')
    const { selectedFile, setSelectedFile } = useContext(FileContext)
    const language = useMemo(() => { // this runs before useEffect
      if(selectedFile) {
        const extension = selectedFile.slice(selectedFile.lastIndexOf('.'));
        return getLanguage(extension);
      }
    }, [selectedFile])

    const handleSave = async() => {
      try {
        await axios.post(`https://127.0.0.1:8443/api/saveFile/${selectedFile}`, {
          content: editorRef.current.getModel().getValue(),
      }, {
          headers: {
            'Content-Type': 'application/json'
          },
        })
        alert('File saved successfully')  
      } catch (error) {
        console.log(error)
        alert('Error saving file')
    }
  }

    useEffect(() => {
      if(!selectedFile) return
      const fetchFile = async () => {
        try{
          const file = await axios.get(`https://127.0.0.1:8443/api/getFile/${selectedFile}`, {
            headers: {
              'Content-Type': 'application/json'
            },
          })
          setContent(file.data)
       }
        catch(error){
          console.log(error)
        }
      }
      fetchFile()
    }, [selectedFile, setSelectedFile])

    useEffect(() => {
      const handleKeyDown = (event) => {
        if(event.ctrlKey && event.key === 's'){
          event.preventDefault()
          const modifiedContent = editorRef1.current.getModel().getValue()
          const original = content
          const differences = diffLines(original, modifiedContent)
          const patchedString = createPatch('file', original, modifiedContent)
          //auta the thelw gia na retrieve, oxi sto save
          // console.log('patched string : ', patchedString)
          // const parsed = parsePatch(patchedString)
          // const patch = applyPatch(original, parsed[0])
          // console.log('patched : ', patch)

         // handleSave()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }, [handleSave])
    // useEffect(()=>{
    //   if(editorRef.current && selectedFile){
    //     const model = editorRef.current.getModel()
    //     model.setValue(content)
    //   } else if(editorRef.current){
    //       model.setValue('')
    //   }
    // }, [selectedFile])

    function handleEditorDidMount(editor, monaco) {
      editorRef1.current = editor;
    }
    const memoizedEditor = useMemo(() => {
      return (
        <>
        <Editor
          height="50vh"
          onMount={handleEditorDidMount}
          value={selectedFile ? content : ''}
          language={selectedFile ? language : ''}
          path={selectedFile ? selectedFile : ''}
          saveViewState={true}
        />
        </>
      )
    }, [selectedFile, handleEditorDidMount])
    return(
      <div> 
        {memoizedEditor}
      </div>
    )
  }