import { useState, createContext } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import styled from '@mui/material/styles/styled'
import ControlledTreeView from './ControlledTreeView.jsx'
import CodeEditor from './CodeEditor.jsx'
import useLogout from '../hooks/useLogout.js'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
export const FileContext = createContext();

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1a2027' : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1), 
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid(){
  const [selectedFile, setSelectedFile] = useState(null)
  const logout = useLogout()
  const navigate = useNavigate()

  const signOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <Link to ='/user'>Go to use </Link>
      <Button onClick={signOut}>Sign out</Button>
      <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
        <Grid container direction="row" justifyContent="center" spacing={2} alignItems="stretch"
          sx={{height:'100vh', width: '100vw', flexGrow: 1}} >
          <Grid item xs={2}>
            <ControlledTreeView/>
          </Grid>
          <Grid item xs={6}>
            <CodeEditor/>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
        </Grid>
      </FileContext.Provider>  
    </>
  );
}