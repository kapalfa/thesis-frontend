import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import { FileContext } from '../MainView';
import { useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';
const deleteFile = ({path, axiosPrivate}) => {
    axiosPrivate.delete(`/deleteFile/${path}`)
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
    const { id } = useParams()
    const { setSelectedFile } = useContext(FileContext)
    const { error, mutate } = useDeleteFile()
    const axiosPrivate = useAxiosPrivate()
    if(error)
        console.log(error)
        
    const handleDeleteFile = () => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            mutate({path, axiosPrivate}, {
                onSuccess: () => {
                    setSelectedFile(null)                    
                    setTimeout(onRefresh(), 1000) // add delay
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