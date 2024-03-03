import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
export default function EmailConfirmation() {
    const [ confirmationCode, setConfirmationCode ] = useState('')
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: () => {
            return axios.post(`/confirmEmail`, {confirmationCode})
        },
        onSuccess: () => {
            navigate('/auth/login')
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate()
    }
    return (
        <Box sx = {{display: 'flex', bgcolor: '#292522', height: '100vh', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
            <Card variant="outlined" sx={{ maxWidth: "500px"}}>
                <CardContent>
                    <Typography variant="h5" component="div" sx={{textAlign:"center"}}>Confirm your email</Typography>
                        <Typography variant="body2" sx={{textAlign:"center"}}>Enter the code you received on your email</Typography>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <TextField sx={{marginTop: 3}} variant="outlined" label="Verification code" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required/>
                <Button variant="text" type="submit">Submit</Button>
            </form>
                </CardContent>
            </Card>
        </Box>
    )
}