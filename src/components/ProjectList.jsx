import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

export default function ProjectList() { 
    const navigate = useNavigate()
    const { auth } = useAuth()
    const [projects, setProjects] = useState([])
    const [ anchorEl, setAnchorEl ] = useState(null)
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleProjectClick = (projectId) => { // otan clickarei se ena project, thelw na kanei redirect sto /project/:id
        const project = projects.find(project => project.id === projectId)
        navigate(`/project/${projectId}`, {state: { project: project }})
    }


    useEffect(() => {
        
        const fetchProjects = async () => {
            try {
                const decoded = jwtDecode(String(auth))
                const userid = decoded.id

                const response = await axios.get(`https://localhost:8443/api/getProjects/${userid}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                setProjects(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchProjects()
    }, [auth])// tha ithela otan create project, na emfanizete kateutheian sto my prijects

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClick}>My Projects</Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {projects.map((project) => {
                    return <MenuItem onClick={()=>handleProjectClick(project.id)} key={project.id}>{project.name}</MenuItem>
                })}
            </Menu>
        </div>
    )
}