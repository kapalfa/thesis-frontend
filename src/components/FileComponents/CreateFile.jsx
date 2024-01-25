import * as React from 'react'
import { API_BASE_URL } from '../../constant'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DialogActions, DialogContent, DialogTitle, Dialog } from '@mui/material'
import Button from '@mui/material/Button'
const createFile = ({filename, path}) => {
    axios.post(`${API_BASE_URL}/createFile/${path}`, {filename})
    .then((response) => {
        if (response.data.message=="File already exists"){
            alert("File already exists")
        }
    })
    .catch(err => {
        console.log(err)
    })
}

const useCreateFile = () => {
    const { error, mutate } = useMutation({
        mutationFn: createFile,
    })
    return { error, mutate }
}

export default function CreateFile({path, onRefresh, onClose}) {
    const [ open, setOpen ] = useState(true)
    const { error, mutate } = useCreateFile()
    if (error)
        console.log(error)

    const handleCreateFile = (event) => {
        event.preventDefault()
        const filename = event.target.filename.value
        mutate({filename, path}, {
            onSuccess: () => {
                event.target.value = null
                setOpen(false)
                onClose()
                onRefresh()
            }
        
        })
    }

    useEffect(() => {
        if(path != null)
            setOpen(true)
    }, [path])
    return (
        <div>
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <DialogTitle>Create File</DialogTitle>
                <form onSubmit={handleCreateFile}>
                    <DialogContent>
                        <input type='text' name="filename"/>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Create</Button>
                        <Button onClick={()=>setOpen(false)}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}