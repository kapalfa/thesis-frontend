import * as React from 'react';
import { API_BASE_URL } from '../../constant';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Button from '@mui/material/Button';
import { FileContext } from '../MainView';
import { useContext } from 'react';

const deleteFile = ({path}) => {
    axios.delete(`${API_BASE_URL}/deleteFile/${path}`)
    .then((response)=>{
        console.log(response.data)
    })
    .catch(err => {
        console.log(err)
    })
}

const useDeleteFile = () => {
    const { error,mutate } = useMutation({
        mutationFn: deleteFile
    })
    return { error, mutate }
}

export default function DeleteFile({path, onRefresh}) {
    const { setSelectedFile } = useContext(FileContext)
    const { error, mutate } = useDeleteFile()
    if(error)
        console.log(error)
        
    const handleDeleteFile = () => {
        mutate({path}, {
            onSuccess: () => {
                setSelectedFile(null)
                onRefresh()
            }
        })
    }

    return (
        <div>
            <Button onClick={handleDeleteFile}>Delete</Button>
        </div>
    )
}