import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const postFile = async ({formData, path}) => {
    const { data } = await axios.post(`https://localhost:8443/api/upload/${path}`, formData)
    return data
}

export const usePostFile = () => {
    const { error, mutate } = useMutation({
        mutationFn: postFile,
    })
    return { error, mutate }
}