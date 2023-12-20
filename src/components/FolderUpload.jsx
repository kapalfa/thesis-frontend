import React from "react";
import axios from "axios";

export default function FolderUpload({path}) {
    const handleUploadFolder = async (event) => {
        const files = event.target.files;
        const formData = new FormData();
        for (const file of files) {
            var filePath = file.webkitRelativePath;
            formData.append("files", file, filePath);
        }
        console.log("formData : ", formData);
        try {
            const { data } = await axios.post(
            "https://localhost:8443/api/uploadFolder",
            formData
            );
            console.log("uploaded file : ", data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <input
            type="file"
            name="files"
            webkitdirectory="true"
            onChange = {handleUploadFolder}
        />
    );
}