import React, { useState } from 'react'
import { Grid, Paper, Box, TextField, Button, Typography, FormControlLabel, Switch} from '@mui/material'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { useMutation } from '@tanstack/react-query'


export default function DownloadRepo () {
    const { auth } = useAuth()
    const [isPublic, setIsPublic] = useState(false)
    const { mutate } = useMutation({
        mutationFn: async (requestData) => {
            try {
                const userid = jwtDecode(auth).id
                const res = await axios.post(`/github/downloadRepo/${userid}`, requestData,
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
      //  const repoName = jsonObject.repoName
        const requestData = {
            repoName: jsonObject.repoName,
            repoDesc: jsonObject.description,
            repoIsPublic: isPublic
        }
        console.log('requestData: ', requestData)
        mutate(requestData)        
    }

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Paper elevation={3} sx={{display:'flex', flexDirection: 'column', width:'420px'}}>
                <Box 
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: '350px',
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h5" component="h2" gutterBottom>  Clone GitHub Repository </Typography>
                    <Grid item xs={12}>
                        <TextField name="repoName" label="Repository Name" variant="outlined" sx={{width: '330px'}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="description" label="Description" variant="outlined" sx={{width:'330px'}} multiline/>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel checked={isPublic} control={<Switch name="isPublic"/>} label="Public" onChange={e=>setIsPublic(e.target.checked)}/>
                    </Grid> 
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">Download</Button>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}