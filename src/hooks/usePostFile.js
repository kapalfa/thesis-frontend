import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const postFile = ({formData, path}) => {
    axios.post(`/upload/${path}`, formData)
    .then(res => {
        if(res.data.message=="File already exists"){
            alert("File already exists")
        }
    })
    .catch(err => {
        console.log(err)
    })
}

export const usePostFile = () => {
    const { error, mutate } = useMutation({
        mutationFn: postFile,
    })
    return { error, mutate }
}

