import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutationState } from '@tanstack/react-query'

const getProjectsByUserid = async (auth, userid) => {
    const { data } = await axios.get(`https://localhost:8443/api/getProjects/${userid}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`
        }
    })
    return data
}
function getProjects(auth){
    const decoded = jwtDecode(String(auth))
    const userid = decoded.id
  
    return useQuery({
        queryKey: ['projects', userid],
        queryFn: () => getProjectsByUserid(auth, userid),
        enabled: !!userid,
        staleTime: 30000,
        select: (data) => {
            const projects = data.map(project => ({ id: project.id, name: project.name }))
            return projects
        },
    })
}
export default function ProjectList() { 
    const navigate = useNavigate()
    const { auth } = useAuth()
    const [ anchorEl, setAnchorEl ] = useState(null)
    const open = Boolean(anchorEl);
    const { status, data : projects, error, isLoading, isFetching } = getProjects(auth)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleProjectClick = (projectId) => { 
        const project = projects.find(project => project.id === projectId)
        navigate(`/project/${projectId}`, {state: { project: project }})
    }
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (status === 'error') {
        return <div>Error: {error.message}</div>
    }
    if (status === 'success') {
        return (
            <div>
                <Button variant="contained" color="primary" onClick={handleClick}>My Projects</Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    {projects.map(({id, name}) => {
                        return <MenuItem onClick={()=>handleProjectClick(id)} key={id}>{name}</MenuItem>
                    })}
                </Menu>
            </div>
        )
    }
}