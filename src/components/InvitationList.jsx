import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import useAuth from '../hooks/useAuth.js'
import { API_BASE_URL } from '../constant.js'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import Invitation from './Invitation.jsx'

function getInvitations(auth){
    const decoded = jwtDecode(String(auth))
    const userid = decoded.id
    return useQuery({
        queryKey: ['invitations'],
        queryFn: async () => {
            const {data} = await axios.get(`${API_BASE_URL}/getInvitations/${userid}`)
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


export default function InvitationList() {
    const { auth } = useAuth()
    const { status, data:invitations, error, isLoading } = getInvitations(auth)
    if (isLoading) return 'Invitations loading...'
    if (error) return 'An error has occurred: ' + error.message
    if(status === 'success' && !invitations) return
    if(status === 'success' && invitations) {
        return (
            
            <Box display="flex" justifyContent="center" sx={{width:'100%', overflow: 'auto', maxHeight: '250px'}}>
                <List>
                {invitations.map(({id, name, description, collaborators}) => (
                    <ListItem key={id} sx={{width: '100%'}}>
                        <Box width="100%">
                    <Card variant="outlined" style={{backgroundColor: "#333333"}}>
                        <Invitation id={id} name={name} description={description} collaborators={collaborators}/>
                    </Card>
                        </Box>
                    </ListItem>
                ))}
                </List>
            </Box>
    )}       
}