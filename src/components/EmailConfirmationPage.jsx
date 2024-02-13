import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../constant'
export default function EmailConfirmation() {
    const [ confirmationCode, setConfirmationCode ] = useState('')
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: () => {
            return axios.post(`${API_BASE_URL}/confirmEmail`, {confirmationCode})
        },
        onSuccess: () => {
            navigate('/login')
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate()
    }
    return (
        <div>
            <h1>Confirm your email</h1>
            <p>Write the code you received on your email</p>
            <form onSubmit={handleSubmit} style={{displat: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <input type="text" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}