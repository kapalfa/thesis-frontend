import * as React from 'react';
import { API_BASE_URL } from '../../constant';
import { useMutation } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import { FileContext } from '../MainView';
import { useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const deleteFile = ({path, axiosPrivate}) => {
    axiosPrivate.delete(`${API_BASE_URL}/deleteFile/${path}`)
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
    const axiosPrivate = useAxiosPrivate()
    if(error)
        console.log(error)
        
    const handleDeleteFile = () => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            mutate({path, axiosPrivate}, {
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