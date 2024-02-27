import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../hooks/useAxiosPrivate.js'
export default function getInvitations(){
    const axiosPrivate = useAxiosPrivate()
    return useQuery({
        queryKey: ['invitations'],
        queryFn: async () => {
            const {data} = await axiosPrivate.get(`/getInvitations`)
            return data
        },
        select: (data) => {
            if (!data) {
                return;
            }
            const invitations = data.map(invitation => ({
                id: invitation.project_id,
                name: invitation.project_name,
                description: invitation.project_description,
                collaborators: invitation.collaborators
            }))
            return invitations
        }
    })
}