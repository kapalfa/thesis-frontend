import React from 'react'
import useAuth from '../hooks/useAuth'
import useGit from '../hooks/useGit'
import { jwtDecode } from 'jwt-decode'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import GroupsIcon from '@mui/icons-material/Groups'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import * as yup from 'yup'
const ProjectCard = ({ id, name, description }) => (
    <Link to={`/project/${id}`} >
        <CardContent>
            <Typography variant="h5" component="div">
                {name}
            </Typography>
            <div style={{maxHeight: '90px', overflow: 'hidden'}}>
                <Typography variant="body2">
                    {description}
                </Typography>
            </div>
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
const getProjectsByUserid = async ( userid, axiosPrivate) => {
    const { data } = await axiosPrivate.get(`/getProjects/${userid}`)
    return data
}
function getProjects(auth, axiosPrivate){ 
    const decoded = jwtDecode(String(auth))
    const userid = decoded.id
  
    return useQuery({
        queryKey: ['projects', userid],
        queryFn: () => getProjectsByUserid( userid, axiosPrivate),
        enabled: !!userid,
        staleTime: 30000,
        select: (data) => {
            const projects = data.map(project => ({ id: project.id, name: project.name, description: project.description }))
            return projects
        },
    })
}
function createInvitation(axiosPrivate) {
    const mutate = useMutation({
        mutationFn: ({email, id}) => {
            try {
                const res = axiosPrivate.post(`/createInvitation`, { email, id })
                return res
            } catch (error) {
                if(error.response.data.message === "User not found") {
                    alert("User not found")
                } else if (error.response.data.message === "User already has access to project") {
                    alert("User already has access to project")
                } 
                console.log(error)
            }   
        },
    })
    return mutate
}
const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Required'),
})
export default function ProjectList() { 
    const axiosPrivate = useAxiosPrivate()
    const { git } = useGit()
    const { auth } = useAuth()
    const { status, data : projects, error, isLoading, refetch } = getProjects(auth, axiosPrivate)
    const mutation = createInvitation(axiosPrivate)
    const [ showForm, setShowForm ] = useState(null)
    const [click, setClick] = useState(-1)
    const [ email, setEmail ] = useState('')
    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            axiosPrivate.delete(`/deleteProject/${id}`)
            .then(() => {
                refetch()
            })  
            .catch((error) => {
                console.log(error)
            })
        }
    }  
    useQuery({
        queryKey: ['gitInit'],
        queryFn: async () => {
            const decoded = jwtDecode(String(auth))
            const userid = decoded.id
            const res = await axiosPrivate.post(`/github/initRepo`, { userid: userid, projectid: click }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setClick(-1)
            return res
        },
        enabled: click !== -1,
    })
    const handleIconClick = (id) => {
        setShowForm(id)
    }
    const handleInputChange = (e) => {
        setEmail(e.target.value)
    }
    const handleFormSubmit = async (e, id) => {
        e.preventDefault()
        try {
            await schema.validate({ email })
        } catch (error) {
            alert(error.errors[0])
            return
        }
        mutation.mutate({email, id})
        setEmail(''),
        setShowForm(false)
    }
    if (isLoading) {
        return <AutorenewIcon animation="border" role="status"><span className='sr-only'>Loading...</span></AutorenewIcon>
    }
    if (status === 'error') {
        if (error.message==="data is null") {
            return <div>No projects found</div>
        }
        return <div>Error: {error.message}</div>
    }
    if (status === 'success' && projects.length != 0) {
        return (
           <ThemeProvider theme={theme}>
                <Grid container spacing={3} sx={{width: '100%'}}>
                    {projects.map(({id, name, description}) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={id}>
                                <Card variant="outlined" style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent:'space-between'}}>
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
                                    <IconButton onClick={()=>handleIconClick(id)} >
                                        <GroupsIcon />  
                                    {showForm === id && (
                                    <form onSubmit={(e)=>handleFormSubmit(e, id)}>
                                        <label>
                                            Email:
                                            <input type="text" value={email} onChange={handleInputChange} />
                                        </label>
                                        <input type="submit" value="Submit" />
                                    </form>)}
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