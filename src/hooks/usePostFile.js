import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from './useAxiosPrivate'

const postFile = (axiosPrivate, {formData, path}) => {
    axiosPrivate.post(`/upload/${path}`, formData)
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
    const axiosPrivate = useAxiosPrivate()
    const { error, mutate } = useMutation({
        mutationFn: (data) => postFile(axiosPrivate, data),
    })
    return { error, mutate }
}

