import axios from 'axios'
import useAuth from '../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../constant'

const getCollaboratorsByProjectId = async (projectId, userId) => {
    const { data } = await axios.get(`${API_BASE_URL}/getCollaborators/${projectId.id}/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return data
}

function getCollaborators(auth, projectId){
    const userId = jwtDecode(auth).id
    return useQuery({
        queryKey: ['collaborators'], 
        queryFn: ()=> getCollaboratorsByProjectId(projectId, userId),
        enabled: !!projectId,
        select: (data) => data
    })
}

const useGetCollaborators = (projectId) => {
    const { auth } = useAuth()
    const { data, status, error } = getCollaborators(auth, projectId)
    
    if (status === 'loading') {
        return 'Loading...'
    }
    if (status === 'error') {
        return `Error: ${error.message}`
    }
    
    return data 
}

export default useGetCollaborators