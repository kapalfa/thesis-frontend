import Button from '@mui/material/Button';
import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
    bottom: '0',
    left: '0',
})

export default function FileUpload({projectId}){

    const handleUpload = async (event) => {
        const file = event.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)
        console.log('formData : ', formData)
        try{
            const { data } = await axios.post('https://localhost:8443/api/upload', formData);
            console.log("uploaded file : ", data);
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <Button variant='contained' component='label' startIcon={<CloudUploadIcon/>}>
            Upload File 
            <VisuallyHiddenInput type='file' name='file' onChange={handleUpload}/>
        </Button>
    )
}