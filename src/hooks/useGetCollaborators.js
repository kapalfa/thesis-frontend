import useAxiosPrivate from "./useAxiosPrivate"
import { useQuery } from "@tanstack/react-query"

const useGetCollaborators = (projectId, id) => {
    const axiosPrivate = useAxiosPrivate()

    return useQuery({
        queryKey: ['collaborators'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get(`/getCollaborators/${projectId}/${id}`)
            return data
        },
        select: (data) => {
            return data
        }
    })
}

export default useGetCollaborators