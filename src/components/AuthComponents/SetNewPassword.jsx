import * as React from 'react'
import axios from '../../api/axios'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { TextField, Button, Typography, Box, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function SetNewPassword() {
    const [ token, setToken ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: () => {
            console.log('token ', token)
            console.log('password: ', password)
            return axios.post(`/setNewPassword`, {token, password},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
        },
        onSuccess: (data) => {
            console.log('data: ', data)
            if (data.message === 'Token expired') {
                alert('Token expired')
            }
            if (data.message === 'Invalid token') {
                alert('Invalid token')
            }
            navigate('/auth/login')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate()
    }

    return (
        <Box sx={{bgcolor: '#292522', display: 'flex', height: '100vh', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
            <Card variant='outlined' sx={{maxWidth:'500px'}}>   
                <CardContent>
                    <Typography sx={{textAlign:"center"}} variant="h5" component="div">Set a new password</Typography>

                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="body2">Enter the code you received on your mail</Typography>
                    <TextField sx={{marginTop: 2, marginBottom: 3}} variant='outlined' label='Verification code' value={token} onChange={(e) => setToken(e.target.value)} required/>
                    <Typography variant="body2">Enter your new password</Typography>
                    <TextField sx={{marginTop: 2}} variant='outlined' label='New password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <Button type="submit">Submit</Button>
                </form>
                </CardContent >
            </Card>
        </Box>
    )
}
