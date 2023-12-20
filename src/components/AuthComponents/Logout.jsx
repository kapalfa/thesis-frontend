import * as React from 'react';
import Button from '@mui/material/Button';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const defaultTheme = createTheme();

export default function Logout() {
  const {auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const handleLogout =  async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://localhost:8443/api/logout', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json'
        },
        credentials: 'include',
      });
      if (response.ok) {
        await response.json();
        setAuth(null)
        navigate('/login', {replace: true})
      } else {
        console.log('Logout failed: ', response);
      }
    } catch (error) {
      console.log(error);
    }
  };  

  return (
    <ThemeProvider theme={defaultTheme}>

    <Button fullWidth variant="contained" onClick={handleLogout}>Log Out</Button>
    </ThemeProvider>
  )
}