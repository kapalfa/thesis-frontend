import React from 'react'
import { Grid, Paper, Box, TextField, Button, Typography, FormControlLabel } from '@mui/material'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { useMutation } from '@tanstack/react-query'

export default function DownloadRepo () {
    const { auth } = useAuth()
    
    const { mutate } = useMutation({
        mutationFn: async (repoName) => {
            try {
                const userid = jwtDecode(auth).id
                const res = await axios.post(`/github/downloadRepo/${userid}`, {repoName},
                    {
                        headers: {
                            'Content-Type': 'application/json', 
                        }
                    })

                console.log('res: ', res)
            } catch (error) {
                console.log('error: ', error)
            }
        },
    })

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        let jsonObject = {}
        for (const [key,value] of data.entries()) { 
          jsonObject[key] = value
        }
        const repoName = jsonObject.repoName
        console.log('repoName: ', repoName)
        mutate(repoName)        
    }

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Paper elevation={3}>
                <Box 
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '20px',
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h6"> Download Repository </Typography>
                    <Grid item xs={12}>
                        <TextField name="repoName" label="Repository Name" variant="outlined" />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <TextField name="description" label="Project description" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch name="isPublic"/>} label="Public" />
                    </Grid> */}
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">Download</Button>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}