import * as React from 'react';
import { API_BASE_URL } from '../../constant';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Button from '@mui/material/Button';
import { FileContext } from '../MainView';
import { useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

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
    const { error, mutate } = useMutation({
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
        if (window.confirm('Are you sure you want to delete this file?')) {
            mutate({path}, {
                onSuccess: () => {
                    setSelectedFile(null)
                    onRefresh()
                }
            })
        }
    }

    return (
        <div>
            <Button onClick={handleDeleteFile} startIcon={<DeleteIcon/>}/>
        </div>
    )
}