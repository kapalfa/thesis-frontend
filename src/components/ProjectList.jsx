import React from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
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
            const projects = data.map(project => ({ id: project.id, name: project.name, description: project.description }))
            return projects
        },
    })
}
export default function ProjectList() { 
    const navigate = useNavigate()
    const { auth } = useAuth()
  //  const [ anchorEl, setAnchorEl ] = useState(null)
  //  const open = Boolean(anchorEl);
    const { status, data : projects, error, isLoading, isFetching } = getProjects(auth)
 //   const handleClick = (event) => {
   //     setAnchorEl(event.currentTarget);    //}

   /// const handleClose = () => {
      //  setAnchorEl(null);
    //}
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
           <ThemeProvider theme={theme}>
                <Grid container spacing={3} sx={{width: '100%'}}>
                    {projects.map(({id, name, description}) => {
            //            return <ListItemLink to={`/project/${id}`} key={id} primary={name} />
                       return (
                            <Grid item xs={12} sm={6} md={4} key={id}>
                                <Card variant="outlined">
                                    <ProjectCard id={id} name={name} description={description}/>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </ThemeProvider>
        )
    }
}