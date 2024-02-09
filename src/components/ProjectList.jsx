import React from 'react'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import useGit from '../hooks/useGit'
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
import GitHubIcon from '@mui/icons-material/GitHub'
import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import GroupsIcon from '@mui/icons-material/Groups';
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
    const { git } = useGit()
    const { auth } = useAuth()
    const { status, data : projects, error, isLoading, refetch } = getProjects(auth)
    const [ showForm, setShowForm ] = useState(false)
    const [click, setClick] = useState(-1)
    const [ email, setEmail ] = useState('')
    const handleDelete = (id) => {
        axios.delete(`${API_BASE_URL}/deleteProject/${id}`)
        .then(() => {
            refetch()
        })  
        .catch((error) => {
            console.log(error)
        })
    }  
    useQuery({
        queryKey: ['gitInit'],
        queryFn: async () => {
            const decoded = jwtDecode(String(auth))
            const userid = decoded.id

            const res = await axios.post(`https://localhost:8443/github/initRepo`, { userid: userid, projectid: click })
            console.log("res: ", res)
            setClick(-1)
            return res
        },
        enabled: click !== -1,
    })
    const handleIconClick = () => {
        setShowForm(true)
    }
    const handleInputChange = (e) => {
        setEmail(e.target.value)
    }
    const handleFormSubmit = async (e, id) => {
        e.preventDefault()
        try {
            console.log("id: ", typeof(id))
            const res = await axios.post(`https://localhost:8443/api/createInvitation`, { email: email, id: id })
            console.log("res: ", res)
            return res
        } catch (error) {
            console.log(error)
        }    
        setEmail('')
       
        setShowForm(false)
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
                                    <Tooltip title="Delete Project" placement="bottom">
                                    <IconButton onClick={()=> handleDelete(id)}>
                                        <DeleteIcon />
                                    </IconButton >
                                    </Tooltip>
                                    {git && <Tooltip title="Initialize Github Repository" placement="bottom">
                                    <IconButton onClick={()=>setClick(id)} >
                                       <GitHubIcon />
                                    </IconButton>
                                    </Tooltip>}
                                    <Tooltip title="Invite Collaborators" placement="bottom">
                                    <IconButton onClick={handleIconClick}>
                                        <GroupsIcon />  
                                    {showForm && (
                                    <form onSubmit={(e)=>handleFormSubmit(e, id)}>
                                        <label>
                                            Email:
                                            <input type="text" value={email} onChange={handleInputChange} />
                                        </label>
                                        <input type="submit" value="Submit" />
                                    </form>
                    )}
                                    </IconButton>
                                    </Tooltip>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </ThemeProvider>
        )
    }
}