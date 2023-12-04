import Button from "@mui/material/Button";
import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: "1px",
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px",
    bottom: "0",
    left: "0",
});

export default function FolderUpload({projectId}) {
    
    const handleUpload = async (event) => {
        const files = event.target.files;
        
        const formData = new FormData();
        for (const file of files) {
            var filePath = file.webkitRelativePath;
        
            formData.append("files", file, filePath);
        }
        formData.append("projectId", projectId);
        console.log("formData : ", formData);
        const { data } = await axios.post(
            "https://localhost:8443/api/uploadFolder",
            formData
        );
        console.log("uploaded file : ", data);
    }

    return (
        <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
        >
            Upload Folder
            <input
                type="file"
                name="files"
                webkitdirectory="true"
                onChange = {handleUpload}
            />
        </Button>
    );
}