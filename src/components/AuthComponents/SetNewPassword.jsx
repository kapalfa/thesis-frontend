import * as React from 'react'
import axios from '../../api/axios'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
export default function SetNewPassword() {
    const [ confirmationCode, setConfirmationCode ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: () => {
            return axios.post(`/setNewPassword`, {confirmationCode, newPassword})
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate({
            onSuccess: () => {
                navigate('/login')
            }
        })
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <h1>Set a new password</h1>
            <p>Enter the code you received on your email and your new password</p>
            <form onSubmit={handleSubmit} >
                <TextField variant='outlined' label='Verification code' value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required/>
                <TextField variant='outlined' label='New password' type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    )
}
