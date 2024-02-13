import useAxiosPrivate from './useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'

const useGetFilesByProject = (projectId) => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['files', projectId], 
        queryFn: async () => {
        const { data } = await axiosPrivate.get(`/getFiles/${projectId}`)
        return data
        },
        enabled: !!projectId,
    })
}

export default useGetFilesByProject