import * as React from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Switch from '@mui/material/Switch'
import FormControllLabel from '@mui/material/FormControlLabel'
import { useEffect } from 'react'
import * as yup from 'yup'
import GithubLogin from '../GithubComponents/GithubLogin'
import axios from '../../api/axios'

const defaultTheme = createTheme()

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Required'),  
  password: yup.string().required('Required'),
})

export default function SignIn() {
  const navigate = useNavigate();
  const { setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit =  async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    let jsonObject = {}
    for (const [key,value] of data.entries()) { 
      jsonObject[key] = value
    }
    const email = jsonObject.email
    try {
      await schema.validate(jsonObject)
    } catch (error) {
      alert(error.errors[0])
      return
    }
    
    axios.post('/login', jsonObject)
      .then(response => {
        const accessToken = response.data.access_token;
        setAuth(accessToken);
        localStorage.setItem('email', email);
        navigate('/main', {replace: true}, {state: {from: from}})  
      }) 
      .catch(err => {
        if (err.response.data.message === "Email not found"){
          alert("User with this email doesn't exist\n")
        } else if (err.response.data.message==="Invalid password"){
          alert("Invalid password\n")
        } else if (err.response.data.message==="User not found"){
          console.log("user not found\n")
        } else if(err.response.data.message==="User not verified"){
          alert("Verify your email\n")
        }
      })
  }

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
          <GithubLogin/>
          <FormControllLabel control={<Switch/>} label="Trust this device" onChange={togglePersist} checked={persist}/>
          <Link to="/auth/register" variant="body2" underline="hover">Don't have an account? Sign up</Link>
          <Link to="/auth/forgotpassword" variant="body2" underline="hover">Forgot password?</Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
}