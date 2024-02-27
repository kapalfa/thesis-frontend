import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FileContext } from '../MainView';
import { useContext } from 'react';
import { useEffect } from 'react';
const deleteFolder = ({ path, axiosPrivate }) => {
    axiosPrivate.delete(`/deleteFolder/${path}`)
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
    const axiosPrivate = useAxiosPrivate()
    const { setSelectedFile } = useContext(FileContext)
    const { error, mutate } = useDeleteFolder()
    if (error)
        console.log(error)

    const handleDeleteFolder = () => {
        mutate({ path, axiosPrivate}, {
            onSuccess: () => {
                setSelectedFile(null)
                onClose()
                setTimeout(onRefresh, 1000) // add delay
            }
        })    
    }
    useEffect(()=> {
        handleDeleteFolder()
    }, [])
}