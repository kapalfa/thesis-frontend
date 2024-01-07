import { Editor } from '@monaco-editor/react'
import { useContext, useRef, useMemo, useEffect } from 'react'
import { FileContext } from './MainView'
import getLanguage from '../../languageDetection/detectLang.js'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function CodeEditor(){
  const queryClient = useQueryClient()
  const { selectedFile } = useContext(FileContext)
  const editorRef = useRef(null)
  const mutateFile = useMutation({
    mutationFn: (formData) => { 
      const file = formData.get('file')
      const filepath = file.name
      return axios.post(`https://localhost:8443/api/saveFile/${filepath}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
     },
    onMutate: async () => {
      await queryClient.cancelQueries(['file', selectedFile])
      const previousData = queryClient.getQueryData(['file', selectedFile])
      queryClient.setQueryData(['file', selectedFile], editorRef.current.getModel().getValue())
      return { previousData }
     },
    onSuccess: async (newData) => {
      await queryClient.setQueryData(['file', selectedFile], newData.data.data)
      return queryClient.invalidateQueries(['file', selectedFile])
    },
    onError: (error, variables, context) => {
     // queryClient.setQueryData(['file', selectedFile], context.previousData)
      console.log('error from useMutation: ', error)
    }
  
  })
  const { status, data, error } = useQuery({
    queryKey: ['file', selectedFile],
    queryFn: async () => {
      const res = await axios.get(`https://localhost:8443/api/getFile/${selectedFile}`)
      return res.data
    },
    enabled: !!selectedFile,
    staleTime: 0,
    gcTime: 0,
  })

  if( status === 'success'){
    console.log('data from get: ', queryClient.getQueryData(['file', selectedFile]))
    console.log('newData: ', data)
  }
  if( status === 'error'){
    console.log('error: ', error)
  }
  if( status === 'loading'){
    console.log('loading')
  }
  if( status === 'idle'){
    console.log('idle')
  }

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

      console.log('data from query: ', queryClient.getQueryData(['file', selectedFile]))
  }

//  const debouncedRequest = useDebounce(handleSave)
  //const onChange = (e) => {
    //debouncedRequest()
  //}
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