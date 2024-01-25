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

export default function Main(){
    const navigate = useNavigate()

    const card = (
        <Box display="flex" justifyContent="center">
        <Card variant="outlined" style={{ width: '55%'}} >
            <CardContent>
                <Typography variant="h5" component="div">
                    Public Projects 
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Discover new projects to collaborate on<br/>
                    See what other people are working on 
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={()=>navigate('/public')}>Explore public projects</Button>
            </CardActions>
        </Card>
        </Box>
    )
    return(
        <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
                <SearchAppBar/>
            </Grid>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                        <Grid container direction="column" justifyContent="center" spacing={10}>
                            <Grid item xs={12} sm={8} md={6}>
                                <CreateProjectForm />        
                            </Grid>
                            <Grid item xs={12} sm={8} md={6}>

                                {card}
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs={8}>
                    <ProjectList/>
                </Grid>
            </Grid> 
        </Grid>
    )
}