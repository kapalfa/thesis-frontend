import React from 'react'
import { usePostFile } from '../../hooks/usePostFile'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useState, useEffect } from 'react'

export default function FileUpload({path, onRefresh, onClose}){
    const [open, setOpen] = useState(false)
    const { error, mutate } = usePostFile(path)
    if (error) {
        console.log(error)
        return 
    }
    const handleUploadFile = async (event) => {
        const file = event.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
         
        mutate({formData, path}, {
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
            <Dialog open={open} onClose={()=>{setOpen(false)}}>
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    <input type='file' name='file' onChange={(event)=>handleUploadFile(event)}/>
                </DialogContent>
                <DialogActions>
                    <button onClick={()=>{setOpen(false)}}>Close</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}