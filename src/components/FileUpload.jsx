import React from 'react';
import styled from '@emotion/styled';
import { usePostFile } from '../hooks/usePostFile';
import { useQueryClient } from '@tanstack/react-query';
const VisuallyHiddenInput = styled('input')({
    // clip: 'rect(0 0 0 0)',
    // clipPath: 'inset(50%)',
    // height: '1px',
    // overflow: 'hidden',
    // position: 'absolute',
    // whiteSpace: 'nowrap',
    // width: '1px',
    // bottom: '0',
    // left: '0',
})

// export default function FileUpload({projectId}){
    // return(
    //     <Button variant='contained' component='label' startIcon={<CloudUploadIcon/>}>
    //         Upload File 
    //         <VisuallyHiddenInput type='file' name='file' onChange={handleUpload}/>
    //     </Button>
    // )
//}

export default function FileUpload({path}){
    const queryClient = useQueryClient()
    const { error, mutate } = usePostFile(path)
    if (error)
        console.log(error)

    const handleUploadFile = async (event) => {
        const file = event.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
         
        mutate({formData, path}, {
            onSuccess: () => { queryClient.invalidateQueries('files') }
        })
    }
    return (
        <div>
            <VisuallyHiddenInput type='file' name='file' onChange={(event)=>handleUploadFile(event)}/>
        </div>
    )
}