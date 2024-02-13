import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Typography } from "@mui/material";
import * as yup from 'yup'

const schema = yup.object().shape({
    projectName: yup.string().required('Project name is required'),
    projectDescription: yup.string().required('Project description is required')
})
export default function CreateProjectForm () {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { auth } = useAuth()
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        let jsonObject = {}
        for (const [key,value] of data.entries()) { 
          jsonObject[key] = value
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
            public: jsonObject.isPublic === 'on'
        }
        try {
            const response = await axiosPrivate.post(`/createProject`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const projectId = response.data.data.id
            navigate(`/project/${projectId}`, {state: { project: response.data.data, from: from }})
        } catch (error) {
            console.log(error)
        }
    }

    return(
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
                    <Typography variant="h4" component="h2" gutterBottom>New Project</Typography>
                    <Grid item xs={12}>
                        <TextField name="projectName" label="Project Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="projectDescription" label="Project Description" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch name="isPublic"/>} label="Public"/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">Create Project</Button>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}