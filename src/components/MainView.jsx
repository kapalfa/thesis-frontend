import { useState, createContext } from 'react'
import Grid from '@mui/material/Grid'
import ControlledTreeView from './ControlledTreeView.jsx'
import useLogout from '../hooks/useLogout.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import CodeEditor from './CodeEditor.jsx'
import ReadonlyCodeEditor from './ReadonlyCodeEditor.jsx'
import Shell from './Shell.jsx'
export const FileContext = createContext();

export default function BasicGrid(){
  const [selectedFile, setSelectedFile] = useState(null)
  const logout = useLogout()
  const navigate = useNavigate()
  const location = useLocation()
  const readonly = location.state?.public
  const collaborators = location.state?.emails
  console.log('collaboratorss: ', collaborators)


  const signOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <Button onClick={signOut}>Sign out</Button>
    {collaborators && <>Collaborators: {collaborators} </>}
      <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
        <Grid container direction="row" justifyContent="center" spacing={2} alignItems="stretch"
          sx={{height:'100vh', width: '100vw', flexGrow: 1}} >
          <Grid item xs={2}>
            <ControlledTreeView readonly={readonly} />
          </Grid>
          <Grid item xs={4}>
            {!readonly && <CodeEditor />}
            {readonly && <ReadonlyCodeEditor />}
          </Grid>
          <Grid item xs={6}>
            <Shell />
          </Grid>
        </Grid>
      </FileContext.Provider>  
    </>
  );
}