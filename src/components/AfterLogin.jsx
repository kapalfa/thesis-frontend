import React from "react";
import CreateProjectForm from "./CreateProject";
import ProjectList from "./ProjectList";
import SearchAppBar from './SearchBar.jsx'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CardActions from '@mui/material/CardActions';
import DownloadRepo from "./GithubComponents/GithubDownload.jsx";
import useGit from "../hooks/useGit.js";
export default function Main(){
    const navigate = useNavigate()
    const { git } = useGit()
    const card = (
        <Box display="flex" justifyContent="center" maxHeight="170px">
        <Card variant="outlined" style={{ width: '70%'}} >
            <CardContent>
                <Typography variant="h5" component="div">
                    Public Projects 
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                    Discover new projects to collaborate on<br/>
                    See what other people are working on 
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={()=>navigate('/public')}>
                    Explore public projects
                </Button>
            </CardActions>
        </Card>
        </Box>
    )
    return(
        <Box sx={{bgcolor: '#292522', height: '100vh'}}>
        <Grid container direction="column" spacing={2} height="100%">
            {/* <Grid item xs={12}>
                <SearchAppBar/>
            </Grid> */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid container direction="column" justifyContent="center" >
                        <Grid item xs={12} sm={8} md={6} style={{flex:1, padding: '10px'}}>
                            <Grid container style={{flex:1, padding: '10px'}}>
                                <Grid item >
                                    <CreateProjectForm />  
                                </Grid>
                                {git && <Grid item >
                                    <DownloadRepo />
                                </Grid>   }
                            </Grid>   
                        </Grid>
                        <Grid item xs={12} sm={8} md={6} style={{flex:0.5, padding: '10px'}}>
                            {card}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <ProjectList/>
                </Grid>   
            </Grid>
        </Grid>
        </Box>
    )
}