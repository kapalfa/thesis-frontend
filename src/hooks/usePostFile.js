import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from './useAxiosPrivate'

const postFile = ({formData, path}) => {
    const axiosPrivate = useAxiosPrivate()
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
    const { error, mutate } = useMutation({
        mutationFn: postFile,
    })
    return { error, mutate }
}

