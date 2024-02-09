import * as React from 'react';
import { API_BASE_URL } from '../../constant';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FileContext } from '../MainView';
import { useContext } from 'react';
import { useEffect } from 'react';
const deleteFolder = ({ path}) => {
    axios.delete(`${API_BASE_URL}/deleteFolder/${path}`)
    .then((response)=>{
        console.log(response.data)
    })
    .catch(err => {
        console.log(err)
    })
}

const useDeleteFolder = () => {
    const { error,mutate } = useMutation({
        mutationFn: deleteFolder
    })
    return { error, mutate }
}
export default function DeleteFolder({ path, onRefresh, onClose }) {
    const { setSelectedFile } = useContext(FileContext)
    const { error, mutate } = useDeleteFolder()
    if (error)
        console.log(error)

    const handleDeleteFolder = () => {
        mutate({ path }, {
            onSuccess: () => {
                setSelectedFile(null)
                onClose()
                onRefresh()
            }
        })    
    }
    useEffect(()=> {
        handleDeleteFolder()
    }, [])
}