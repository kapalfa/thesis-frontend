import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from './useAxiosPrivate'

// const postFile = (axiosPrivate, {formData, path}) => {
//     axiosPrivate.post(`/upload/${path}`, formData)
//     .then(res => {
//         if(res.data.message=="File already exists"){
//             alert("File already exists")
//         }
//     })
//     .catch(err => {
//         console.log(err)
//     })
// }

export const usePostFile = () => {
    const axiosPrivate = useAxiosPrivate()
    const { error, mutate } = useMutation({
        mutationFn: ({formData, path}) => {
            console.log('formData in usePostFIle: ', formData)
            axiosPrivate.post(`/upload/${path}`, {formData})
            .then(res => {
                if(res.data.message=="File already exists"){
                    alert("File already exists")
                }
            }) 
            .catch(err => {
                console.log(err)
            })
        },
    })
    return { error, mutate }
}

