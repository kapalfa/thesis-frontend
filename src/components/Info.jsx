import React from 'react';
import { Button } from '@mui/material';
import CommitIcon from '@mui/icons-material/Commit';
import useLogout from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import useGetCollaborators from '../hooks/useGetCollaborators';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import useGit from '../hooks/useGit';

export default function Info() {
    const { git } = useGit()
    const projectId = useParams()
    const collaborators = useGetCollaborators(projectId) 
    const readonly = location.state?.public
    const logout = useLogout()
    const navigate = useNavigate()
    const signOut = async () => {
        await logout()
        navigate('/login')
    }
    const mutation=useMutation({
        mutationFn: async () => {
            try {
                const response = await axios.post(`https://localhost:8443/github/commitRepo`, { projectid: projectId, userid: decoded.id})
                console.log('response: ', response)
            } catch (error) {
                console.log('error: ', error)
            }
        }
    })

    const handleCommit = () => {
        mutation.mutate()
    }
    return (
        <div style={{marginBottom: '30px'}}>
            <Card variant="outlined" sx={{width:400, height:40, backgroundColor: "#002c2b", alignContent: 'center', marginBottom: '10px'}}>
                <div style={{ flexDirection:'row', display:"flex", alignContent:'center', alignItems:"center"}}>
                <AccountCircleIcon style={{color: "#ffbc11", fontSize: '40px'}}/>
                <span style={{color: "#ffbc11", fontSize: '16px', fontFamily: 'Arial'}}>{localStorage.getItem('email')}</span>
            </div>
            </Card>
        <Card variant='outlined' sx={{width:400, height:60, backgroundColor: "#002c2b", alignContent: 'center'}}>
            {collaborators && <span style={{color: "#ffbc11", fontSize: '16px', fontFamily: 'Arial'}}>Collaborators: {collaborators.join(', ')} </span>}
        </Card>

        <Button size="small" sx={{width:400,backgroundColor: "#002c2b", marginTop: '10px', color: "#ffbc11", fontSize: '16px', fontFamily: 'Arial'}} onClick={signOut} >Sign out</Button>
       {!readonly && git && <Button sx={{width:400,backgroundColor: "#002c2b", marginTop: '10px', color: "#ffbc11", fontSize: '16px', fontFamily: 'Arial'}} startIcon={<CommitIcon style={{color: "ffbc11"}}/>} onClick={()=>handleCommit()}>Commit to Github</Button>}
        </div>
    )
}