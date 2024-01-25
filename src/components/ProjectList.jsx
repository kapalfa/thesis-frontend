import React from 'react'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../constant'

const ProjectCard = ({ id, name, description }) => (
    <Link to={`/project/${id}`} >
        <CardContent>
            <Typography variant="h5" component="div">
                {name}
            </Typography>
            <Typography variant="body2">
                {description}
            </Typography>
        </CardContent>
    </Link>
);
const theme = createTheme({
     palette: {
        primary: {
            main: '#173A5E',
        },
        background: {
            paper: '#fff'
        },
        text: {
           primary: '#fffff',
        },
        action: {
            active: '#001E3C',
        },
        success: {
           main: '#009688',
           dark: '#009688'
        },
     },
})
const getProjectsByUserid = async (auth, userid) => {
    const { data } = await axios.get(`${API_BASE_URL}/getProjects/${userid}`, {
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
            const projects = data.map(project => ({ id: project.id, name: project.name, description: project.description }))
            return projects
        },
    })
}

export default function ProjectList() { 
    const { auth } = useAuth()
    const { status, data : projects, error, isLoading, refetch } = getProjects(auth)

    const handleDelete = (id) => {
        axios.delete(`${API_BASE_URL}/deleteProject/${id}`)
        .then(() => {
            refetch()
        })  
        .catch((error) => {
            console.log(error)
        })
    }
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (status === 'error') {
        if (error.message==="data is null") {
            return <div>No projects found</div>
        }
        return <div>Error: {error.message}</div>
    }
    if (status === 'success') {
        return (
           <ThemeProvider theme={theme}>
                <Grid container spacing={3} sx={{width: '100%'}}>
                    {projects.map(({id, name, description}) => {
                       return (
                            <Grid item xs={12} sm={6} md={4} key={id}>
                                <Card variant="outlined">
                                    <ProjectCard id={id} name={name} description={description}/>
                                    <IconButton onClick={()=> handleDelete(id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </ThemeProvider>
        )
    }
}