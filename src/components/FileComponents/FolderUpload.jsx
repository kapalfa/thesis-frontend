import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, DialogContent } from "@mui/material";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const postFolder = ({formData, path, axiosPrivate}) => {
    axiosPrivate.post(`/uploadFolder/${path}`, formData,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    })
    .then((res) => {
        if(res.data.message === "Folder already exists") {
            alert("Folder already exists");
        }
        return 
    })
    .catch((err) => {
        console.log(err);
        throw err
    });
}

const usePostFolder = () => {
    const { error, mutate } = useMutation({
        mutationFn: postFolder,
    });
    return { error, mutate };
}
export default function FolderUpload({path, onRefresh, onClose}) {
    const axiosPrivate = useAxiosPrivate()
    const [open, setOpen] = useState(false);
    const { error, mutate } = usePostFolder();
    if (error) console.log(error);

    const handleUploadFolder = async(event) => {
        const folder = event.target.files;
        const formData = new FormData();
        for (const file of folder) {
            var filePath = file.webkitRelativePath;
            formData.append("folder", file, filePath);
        }
        mutate({formData, path, axiosPrivate}, {
            onSuccess: () => {
                event.target.value = null;
                setOpen(false);
                onClose();
                setTimeout(onRefresh(), 1000)
            }
        })
    }
    useEffect(() => {
        if(path != null)
            setOpen(true);
    }, [path])

    return (
        <>
        <Dialog open={open} onClose={()=>setOpen(false)}>
            <DialogTitle>Upload Folder</DialogTitle>
            <DialogContent>
            <input
                type="file"
                name="folder"
                webkitdirectory="true"
                onChange={(event)=>{handleUploadFolder(event)}}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}