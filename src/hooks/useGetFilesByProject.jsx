import useAxiosPrivate from './useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'

const useGetFilesByProject = (projectId) => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['files', projectId], 
        queryFn: () => new Promise((resolve, reject) => {
            setTimeout( async () => {
                try {
                    const { data } = await axiosPrivate.get(`/getFiles/${projectId}`)
                    resolve(data)
                } catch (error) {
                    reject(error)
                }
            }, 2000)
        }),
   //     const { data } = await axiosPrivate.get(`/getFiles/${projectId}`)
     //   return data
       // },
        enabled: !!projectId,
    })
}

export default useGetFilesByProject