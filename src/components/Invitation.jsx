import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { CardContent } from '@mui/material'
import useAxiosPrivate from '../hooks/useAxiosPrivate.js'
function postInvitationResponse(){
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, response}) => {
            return axiosPrivate.post(`/handleInvitation/${id}`, {response})},
        onSuccess: () => {
            queryClient.invalidateQueries(['invitations'])
        }
    })
}

export default function Invitation({ id, name, description, collaborators, handleDialogClose}) {
    const mutation = postInvitationResponse()
    const handleInvite = async (response) => {
        mutation.mutate({id, response}, {
            onSuccess: () => {
                handleDialogClose()
            }
        })
    }
    return (
        <CardContent>
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
            <Button variant="contained" color="primary" onClick={()=>handleInvite('yes')}> Accept </Button>
            <Button variant="contained" color="secondary" onClick={()=>handleInvite('no')}> Reject </Button>
        </Box>
        </CardContent>
    )
}