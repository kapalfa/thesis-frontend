import * as React from 'react'
import axios from '../../api/axios'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { TextField, Button, Box, CardContent, Card, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
export default function ForgotPassword() {
    const navigate = useNavigate()  
    const [ email, setEmail ] = useState('')
    const mutation = useMutation({
        mutationFn: () => {
            return axios.post('/forgotPassword', {email})
        },
        onSuccess: () => {
            navigate('/setNewPassword')
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate()
    }
    return (
        <Box sx = {{bgcolor: '#292522', height: '100vh'}}>
            <Card variant="outlined" sx={{position:"absolute", top:"50%", left: "50%", transform:"translate(-50%,-50%)", maxWidth:"500px"}}>
                <CardContent>
                    <Typography variant="h5" component="div" sx={{textAlign:"center"}}>Forgot Password</Typography>
                    <Typography variant="body2" sx={{textAlign:"center"}}>Enter your email to reset your password</Typography>

                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <TextField variant='outlined' label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Button variant="text" type="submit">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}