import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'
export default function CreateProjectForm () {
    const { auth } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        let jsonObject = {}
        for (const [key,value] of data.entries()) { 
          jsonObject[key] = value
        }
        const decoded = jwtDecode(auth)

        const requestData = {
            name: jsonObject.projectName,
            description: jsonObject.projectDescription,
            user_id: decoded.id,
            public: jsonObject.isPublic === 'on'
        }
        try {
            const response = await axios.post('https://localhost:8443/api/createProject', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const projectId = response.data.data.id
            console.log("response.data from createProject : ", response.data.data)
            navigate(`/project/${projectId}`, {state: { project: response.data.data }})

        } catch (error) {
            console.log(error)
        }
    }

    return(
        <Box 
            component="form" 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <TextField name="projectName" label="Project Name" variant="outlined" />
            <TextField name="projectDescription" label="Project Description" variant="outlined" />
            <FormControlLabel control={<Switch name="isPublic"/>} label="Public"/>
            <Button variant="contained" type="submit">Create Project</Button>
        </Box>
    )
}