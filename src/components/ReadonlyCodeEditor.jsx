import { Editor } from '@monaco-editor/react'
import React from 'react'
import { useContext, useRef, useMemo, useState } from 'react'
import { FileContext } from './MainView'
import getLanguage from '../../languageDetection/detectLang.js'
import useAxiosPrivate from '../hooks/useAxiosPrivate.js'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'

export default function ReadonlyCodeEditor(){
  const [ fileContent, setFileContent ] = useState('')
  const { selectedFile } = useContext(FileContext)
  const editorRef = useRef(null)
  const axiosPrivate = useAxiosPrivate()
  
  const { status, data } = useQuery({
    queryKey: ['file', selectedFile],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/getFile/${selectedFile}`,{
        params: {
          _: new Date().getTime()
        }
      })
      return res.data
    },
    onSuccess: (data) => setFileContent(data.data),
    enabled: !!selectedFile,
    staleTime: 0,
    gcTime: 0,
  })
  
  const language = useMemo(() => { // this runs before useEffect
      if(selectedFile) {
        const extension = selectedFile.slice(selectedFile.lastIndexOf('.'));
        return getLanguage(extension);
      }
  }, [selectedFile])
 
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;   
  }

  return(
    <>
      <Grid container direction="row" justifyContent="center" spacing={2} alignItems="stretch"
        sx={{height:'100vh', width: '100vw', flexGrow: 1}} >
        <Grid item xs={6}>
          {status === 'success' && 
            <Editor
              height="90vh"
              onMount={handleEditorDidMount}
              defaultValue={data}
              value={fileContent}
              language={selectedFile ? language : ''}
              path={selectedFile ? selectedFile : ''}
              options={{readOnly: true}}
            />
          }
        </Grid>
      </Grid>
    </>
  )
}