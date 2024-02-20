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
    
    const handleSubmit = async (event) => {
        event.preventDefault()
      //  const data = new FormData(event.currentTarget)
      //  let jsonObject = {}
        const jsonObject = {
            projectName,
            projectDescription,
            isPublic
        }

        // for (const [key,value] of data.entries()) { 
        //   jsonObject[key] = value
        // }
        try{
            await schema.validate(jsonObject)
        } catch (error) {
            alert(error.errors[0])
            return
        }
        const decoded = jwtDecode(auth)
        console.log("isPublic: ", jsonObject.isPublic)
        const requestData = {
            name: jsonObject.projectName,
            description: jsonObject.projectDescription,
            user_id: decoded.id,
            public: jsonObject.isPublic === 'on'
        }
        try {
            await axiosPrivate.post(`/createProject`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setProjectName('')
            setProjectDescription('')
            setIsPublic(false)
        } catch (error) {
            console.log(error)
        }
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
                        <FormControlLabel checked={isPublic} control={<Switch name="isPublic"/>} label="Public" onChange={e=>{console.log("checkd: ", e.target.checked);setIsPublic(e.target.checked)}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">Create Project</Button>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}