import axios from 'axios'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { API_BASE_URL } from '../constant.js'
import useAuth from '../hooks/useAuth.js'
import { jwtDecode } from 'jwt-decode'
function postInvitationResponse(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, userid, response}) => {
            return axios.post(`${API_BASE_URL}/handleInvitation/${id}/${userid}`, {response},
            {headers: {'Content-Type': 'application/json'}})
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['invitations'])
        }
    })
}

export default function Invitation({ id, name, description, collaborators}) {
    const { auth } = useAuth()
    const userid = jwtDecode(auth).id
    const mutation = postInvitationResponse()
    const handleInvite = async (userid, response) => {
        mutation.mutate({id, userid, response})
    }
    return (
        <CardContent style={{color: "#fbffe3"}}>
        <Typography variant="body1">
            {name}
        </Typography>
        <Typography variant="subtitle2" >
            {description}
        </Typography>
        <Typography variant="subtitle2">
            Collaborators: {collaborators?.join(', ')}
        </Typography>
        <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={()=>handleInvite(userid, 'yes')}> Accept </Button>
            <Button variant="contained" color="secondary" onClick={()=>handleInvite(userid, 'no')}> Reject </Button>
        </Box>
    </CardContent>
    )
}