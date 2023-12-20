import { Editor } from '@monaco-editor/react'
import { useContext, useRef, useMemo, useEffect } from 'react'
import { FileContext } from './MainView'
import getLanguage from '../../languageDetection/detectLang.js'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useSaveFile } from '../hooks/useSaveFile.jsx'
import { useDebounce } from '../hooks/useDebounce.js'

function getFile(obj){
  const { data, isError, error, status, refetch } = useQuery({
   // queryKey: [obj], 
    queryKey: ['file'],
    queryFn: async () => { 
      const filepath = { obj }.obj
      const strfile = String(filepath)
      console.log('filepath from getFile: ', strfile)
      console.log('filepath : ', filepath)
      const { data } = await axios.get(`https://127.0.0.1:8443/api/getFile/${filepath}`) 
      return { data }
    },
    enabled: !!obj, 
   // gcTime: 0,
  //  staleTime: 10000,
  })
  if(isError) {
    return { data : '', isError, error, refetch }
  }
  if(status === 'success') {
    return { data: String(data.data), status, refetch }
  }
  return { data : '', status, refetch }
}

export default function CodeEditor(){
  const { selectedFile } = useContext(FileContext)
  const { data, status, refetch } = getFile(selectedFile) 
  const editorRef = useRef(null)
  const { mutate } = useSaveFile(selectedFile, refetch) 

  const language = useMemo(() => { // this runs before useEffect
      if(selectedFile) {
        const extension = selectedFile.slice(selectedFile.lastIndexOf('.'));
        return getLanguage(extension);
      }
  }, [selectedFile])

  const handleSave = async() => {
      const file = new File([editorRef.current.getModel().getValue()], selectedFile, {type: 'text/plain'})
      const formData = new FormData()
      formData.append('file', file)
      mutate({ formData, path: selectedFile })
  }
 
//  const debouncedRequest = useDebounce(handleSave)
  //const onChange = (e) => {
    //debouncedRequest()
  //}
  useEffect(() => {
    const handleKeyDown = (event) => {
      if(event.ctrlKey && event.key === 's'){
        event.preventDefault()        
        handleSave()
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
    editorRef.current = editor;
  }

  return(
    <Editor
      height="100vh"
      onMount={handleEditorDidMount}
      value={status=='success' ? data : ''}
      language={selectedFile ? language : ''}
      path={selectedFile ? selectedFile : ''}
    //  onChange={onChange}
    />
  )
}