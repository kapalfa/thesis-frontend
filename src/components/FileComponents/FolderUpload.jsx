import React, { useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "../../constant";
import { Button, DialogContent } from "@mui/material";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useState } from "react";

const postFolder = ({formData, path}) => {
    axios.post(`${API_BASE_URL}/uploadFolder/${path}`, formData)
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
    const [open, setOpen] = useState(false);
    const { error, mutate } = usePostFolder();
    if (error) console.log(error);

    console.log("path: ", path)
    const handleUploadFolder = async(event) => {
        const folder = event.target.files;
        const formData = new FormData();
        for (const file of folder) {
            var filePath = file.webkitRelativePath;
            formData.append("folder", file, filePath);
        }
        mutate({formData, path}, {
            onSuccess: () => {
                event.target.value = null;
                setOpen(false);
                onClose();
                onRefresh();
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