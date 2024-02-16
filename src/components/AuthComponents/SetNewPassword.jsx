import * as React from 'react'
import axios from '../../api/axios'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { TextField, Button, Typography, Box, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function SetNewPassword() {
    const [ confirmationCode, setConfirmationCode ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: () => {
            return axios.post(`/setNewPassword`, {confirmationCode, newPassword})
        },
        onSuccess: (data) => {
            if (data.message === 'Token expired') {
                alert('Token expired')
            }
            if (data.message === 'Invalid token') {
                alert('Invalid token')
            }
            navigate('/login')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate()
    }

    return (
        <Box sx={{bgcolor: '#292522', height: '100vh'}}>
            <Card variant='outlined' sx={{alignItems: 'center', justifyContent: 'center', maxWidth: '500px'}}>   
                <CardContent>
                    <Typography variant="h5" component="div">Set a new password</Typography>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                   
                    <Typography variant="body2">Enter the code you received on your mail</Typography>
                    <TextField sx={{marginTop: 2, marginBottom: 2}} variant='outlined' label='Verification code' value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required/>
                    <Typography variant="body2">Enter your new password</Typography>
                    <TextField sx={{marginTop: 2}} variant='outlined' label='New password' type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                    <Button type="submit">Submit</Button>
                </form>
                </CardContent >
            </Card>
        </Box>
    )
}
