import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from '../../constant';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const createFolder = ({foldername, path, axiosPrivate}) => {
    axiosPrivate.post(`${API_BASE_URL}/createFolder/${path}`, {foldername})
    .then((response) => {
        if (response.data.message=="Folder already exists"){
            alert("Folder already exists")
        }
    })
    .catch(err => {
        console.log(err)
    })
}

const useCreateFolder = () => {
    const { error, mutate } = useMutation({
        mutationFn: createFolder,
    });
    return { error, mutate };
}

export default function CreateFolder({path, onRefresh, onClose}) {
    const [open, setOpen] = useState(true);
    const { error, mutate } = useCreateFolder();
    if (error) console.log(error);
    const axiosPrivate = useAxiosPrivate();

    const handleCreateFolder = (event) => {
        event.preventDefault();
        const foldername = event.target.foldername.value;
        mutate({foldername, path, axiosPrivate}, {
            onSuccess: () => {
                event.target.value = null;
                setOpen(false);
                onClose();
                onRefresh();
            }
        });
    }

    useEffect(() => {
        if(path != null)
            setOpen(true);
    }, [path]);

    return (
        <div>
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <DialogTitle>Create Folder</DialogTitle>
                <form onSubmit={handleCreateFolder}>
                    <DialogContent>
                        <input type='text' name="foldername"/>
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