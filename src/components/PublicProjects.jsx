import { useQuery } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography' 
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'
import { useMutation } from '@tanstack/react-query'
import useAuth from '../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Box from '@mui/material/Box'
const ProjectCard = ({name, description, emails}) => (
    <CardContent>
        <Typography variant="h5" component="div">
            {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {description}
        </Typography>
        <Typography variant="body2">
            Collaborators: {emails.join(', ')}
        </Typography>
    </CardContent>
)
function getPublicProjectsQuery(axiosPrivate) {
    return useQuery({
        queryKey: ['publicProjects'],
        queryFn: async () => {
            const response = await axiosPrivate.get(`/getPublicProjects`);
            return response.data 
        },
        staleTime: 30000,
        select: (data) => {
            const projects = data.map(project => ({ id: project.id, name: project.name, description: project.description, emails: project.collaborators.map(collaborator => collaborator.email)}))
            return projects
        },
    })
}
export default function PublicProjectList() {
    const { auth } = useAuth()
    const userid = jwtDecode(String(auth)).id
    const axiosPrivate = useAxiosPrivate()
    const { status, data: projects, error, isLoading } = getPublicProjectsQuery(axiosPrivate)
    const copyProject = useMutation({
        mutationFn: (id) => {
            axiosPrivate.post(`/copyProject`, {
                projectid: String(id),
                userid: String(userid),
            }, 
            {
                headers: { 'Content-Type': 'application/json' }
            })
        }
    })
    const navigate = useNavigate()
    const handleCopy = ({id}) => {
        copyProject.mutate(id)
    }
    const handleButtonClick = ({id, emails}) => {
        navigate(`/project/${id}`,  {state: { public: 1, emails:emails}})
    }
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (status === 'error') {
        if(error.message === "data is null"){
            return <div>No projects found</div>
        }
        return <div>Error: {error.message}</div>
    }
    if (status === "success") {
        return (
            <Box sx={{display: 'flex', bgcolor: '#292522', height: '100vh', flexDirection: 'column'}}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h2" sx={{color: 'white', textAlign: 'center', mt: 2}}>
                        Public Projects 
                    </Typography>
                </Grid>
             <Grid  item container spacing={3} sx={{width: '100%', mt:2}}>
                {projects.map(({id, name, description, emails}) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} key={id}>
                            <Card variant="outlined" sx={{m:2}}>
                                <ProjectCard id={id} name={name} description={description} emails={emails}/>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={()=>handleButtonClick({id, emails})}>
                                        Go to project
                                    </Button>
                                    <Button size="small" color="primary" onClick={()=>handleCopy({id})}>
                                        Copy Project
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })}
             </Grid> 
            </Box>
        )    
    }
}