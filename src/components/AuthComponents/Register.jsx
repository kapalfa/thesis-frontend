import * as React from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Link }  from "react-router-dom"
import axios from '../../api/axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
const defaultTheme = createTheme()

export default function Register() {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .required('Required'),
    }),
    onSubmit: values => {
      handleSubmit(values);
    }
  })
 
  const handleSubmit = (values) => {
    axios.post(`/register`, values, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then(function (response) {
      if (response.data.status === "error") {
        if (response.data.message === "User already exists") {
          formik.setErrors({email: "User already exists"})
        }//if response ok, navigate to confirmation page with a form to input the token
      } else {
        navigate("/confirmEmail")
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}} >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email Address"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
            </Grid>
            <Grid item xs={12}>
             <TextField
                fullWidth       
                type="password"
                label="Password"
                id="password"
             {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
      </form>
        <Link to="/auth/login" variant="body2" underline="hover">Already have an account? Log in</Link>
      </Box>
    </Container>
  </ThemeProvider>
);
}