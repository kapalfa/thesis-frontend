import { Editor } from '@monaco-editor/react'
import { useContext, useRef, useMemo, useEffect, useState } from 'react'
import { FileContext } from './MainView'
import getLanguage from '../../languageDetection/detectLang.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '../hooks/useAxiosPrivate.js'
import axios from '../api/axios.js'
import { API_BASE_URL } from '../constant.js'
export default function CodeEditor(){
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [ fileContent, setFileContent ] = useState('')
  const { selectedFile } = useContext(FileContext)
  const editorRef = useRef(null)
  const mutateFile = useMutation({
    mutationFn: (formData) => { 
      const file = formData.get('file')
      const filepath = file.name
      return axiosPrivate.post(`/saveFile/${filepath}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // return axios.post(`${API_BASE_URL}/saveFile/${filepath}`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
     },
    // onMutate: async () => {
    //   await queryClient.cancelQueries(['file', selectedFile])
    //   const previousData = queryClient.getQueryData(['file', selectedFile])
    //   queryClient.setQueryData(['file', selectedFile], editorRef.current.getModel().getValue())
    //   return { previousData }
    //  },
    onSuccess: (newData) => {
      setFileContent(newData.data.data)
    //   await queryClient.setQueryData(['file', selectedFile], newData.data.data)
    //   return queryClient.invalidateQueries(['file', selectedFile])
    },
    onError: (error, variables, context) => {
     // queryClient.setQueryData(['file', selectedFile], context.previousData)
      console.log('error from useMutation: ', error)
    }
  
  })
  const { status, data } = useQuery({
    queryKey: ['file', selectedFile],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/getFile/${selectedFile}`,{
        params: {
          _: new Date().getTime()
        }
      })
      return res.data
    },
    onSuccess: (data) => setFileContent(data.data),
    enabled: !!selectedFile,
  })
  
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
      mutateFile.mutate(formData,
        { onSuccess: (data) => { queryClient.setQueryData(['file', selectedFile], data.data.data)}})
     // data = formData.get('file')
     /// queryClient.invalidateQueries({queryKey: [selectedFile]})
     // queryClient.setQueriesData([selectedFile], editorRef.current.getModel().getValue())
  }

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if(event.ctrlKey && event.key === 's'){
        event.preventDefault()        
        await handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedFile])
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;   
  }

  return(
    <>
      {status === 'success' && 
        <Editor
            height="95vh"
            onMount={handleEditorDidMount}
            defaultValue={data}
            value={fileContent}
            language={selectedFile ? language : ''}
            path={selectedFile ? selectedFile : ''}
          />
        }
    </>
  )
}