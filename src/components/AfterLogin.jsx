import React, { useState } from "react";
import CreateProjectForm from "./CreateProject";
import ProjectList from "./ProjectList";
import SearchAppBar from './SearchBar.jsx'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
export default function Main(){

    return(
        <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
            <SearchAppBar/>
            </Grid>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <Box display="flex" justifyContent="center">
                <CreateProjectForm />
                </Box>
                </Grid>
                <Grid item xs={8}>
           <ProjectList/>
                </Grid>
            </Grid> 
        </Grid>
    )
}