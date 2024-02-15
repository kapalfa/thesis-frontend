import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useState, useEffect } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'
export default function FileUpload({path, onRefresh, onClose}){
    const [open, setOpen] = useState(false)
    const axiosPrivate = useAxiosPrivate()
    const { error, mutate } = useMutation({
        mutationFn: ({formData, path}) => {
            axiosPrivate.post(`/upload/${path}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            .then(res => {
                console.log("resdata: ", res.data)
                if(res.data.message=="File already exists"){
                    alert("File already exists")
                }
            }) 
            .catch(err => {
                console.log("errrro: ", err)
            })
        },
    })
    if (error) {
        console.log("ER: ", error)
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
                setTimeout(onRefresh(), 1000) // add delay
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