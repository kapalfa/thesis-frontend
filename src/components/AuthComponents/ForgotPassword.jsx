import * as React from 'react'
import axios from '../../api/axios'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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
        <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <h1>Enter your email</h1>
        <form onSubmit={handleSubmit}>
            <TextField variant='outlined' label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button variant="text" type="submit">Submit</Button>
        </form>
        </div>
    )
    }