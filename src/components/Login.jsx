import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Switch from '@mui/material/Switch';
import FormControllLabel from '@mui/material/FormControlLabel';
import { useEffect } from 'react';
const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const { auth, setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit =  async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    let jsonObject = {}
    for (const [key,value] of data.entries()) { 
      jsonObject[key] = value
    }

    try {
      const response = await fetch('https://localhost:8443/api/login', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(jsonObject),
      });
      if (response.ok) {
        const res = await response.json();
        const accessToken = res.access_token;
        setAuth(accessToken);
        navigate('/home', {replace: true}, {state: {from: from}})
      } else {
        console.log('Login failed: ', response)
      }
    } catch (error) {
      console.log(error);
    }
  };  

  const togglePersist = () => {
    setPersist(prev => !prev)
  }

  useEffect(() => {
    localStorage.setItem('persist', persist)
  }, [persist])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >    
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <FormControllLabel control={<Switch/>} label="Trust this device" onChange={togglePersist} checked={persist}/>
          <Link to="/register" variant="body2" underline="hover">Don't have an account? Sign up</Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
}