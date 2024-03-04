import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Typography } from "@mui/material";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as yup from 'yup'

const schema = yup.object().shape({
    projectName: yup.string().required('Project name is required'),
    projectDescription: yup.string().required('Project description is required')
})
export default function CreateProjectForm () {
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (requestData) => { return axiosPrivate.post(`/createProject`, requestData)},
        onSuccess: () => {
            queryClient.invalidateQueries('projects')
            setProjectName('')
            setProjectDescription('')
            setIsPublic(false)
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const handleSubmit = async (event) => {
        event.preventDefault()
        const jsonObject = {
            projectName,
            projectDescription,
            isPublic
        }

        try{
            await schema.validate(jsonObject)
        } catch (error) {
            alert(error.errors[0])
            return
        }
        const decoded = jwtDecode(auth)
        const requestData = {
            name: jsonObject.projectName,
            description: jsonObject.projectDescription,
            user_id: decoded.id,
            public: jsonObject.isPublic
        }
        mutation.mutate(requestData)
    }

    return(
        <Grid container justifyContent="center" alignItems="center">
            <Paper elevation={3} >
                <Box 
                    component="form" 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: '370px'
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >   
                    <Typography variant="h4" component="h2" gutterBottom>Create Project</Typography>
                    <Grid item xs={12}>
                        <TextField value={projectName} name="projectName" label="Project Name" variant="outlined" sx={{width: '330px'}} onChange={e=>setProjectName(e.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField value={projectDescription} name="projectDescription" label="Project Description" variant="outlined" sx={{width: '330px'}} multiline onChange={e=>setProjectDescription(e.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel checked={isPublic} control={<Switch name="isPublic"/>} label="Public" onChange={e=>setIsPublic(e.target.checked)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">Create Project</Button>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}