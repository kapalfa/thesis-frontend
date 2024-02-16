import * as React from 'react'
import axios from '../../api/axios'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export default function ForgotPassword() {
    const [ email, setEmail ] = useState('')
    const mutation = useMutation({
        mutationFn: () => {
            return axios.post('/forgotPassword', {email})
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate()
    }
    return (
        <div>
        <h1>Enter your email</h1>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <button type="submit">Submit</button>
        </form>
        </div>
    )
    }