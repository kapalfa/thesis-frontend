import React, { useState } from "react";
import Button from "@mui/material/Button";
import CreateProjectForm from "./CreateProject";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import ProjectList from "./ProjectList";
import SearchAppBar from './SearchBar.jsx'

export default function Main(){
    const [ showForm, setShowForm ] = useState(false)
   
    const handleButtonClick = () => {
        setShowForm(true)
    }

    const handleClose = () => {
        setShowForm(false)
    }

    return(
        <div>
            <SearchAppBar/>
            <Button variant="contained" color="primary" onClick={handleButtonClick}>Create Project</Button>
            <Dialog open={showForm} onClose={handleClose}>
                <DialogTitle>Create Project</DialogTitle>
                <CreateProjectForm />
            </Dialog>

           <ProjectList/>

        </div>
    )
}