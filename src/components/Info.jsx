import React from 'react';
import { Button } from '@mui/material';
import CommitIcon from '@mui/icons-material/Commit';
import Card from '@mui/material/Card';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useGit from '../hooks/useGit';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { jwtDecode } from 'jwt-decode';
export default function Info() {
    const logout = useLogout()
    const { auth } = useAuth()
    const { git } = useGit()
    const projectId = useParams()
    const readonly = location.state?.public
    const axiosPrivate = useAxiosPrivate()
    const id = jwtDecode(auth).id
    const collaborators = useQuery({
        queryKey: ['collaborators'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get(`/getCollaborators/${projectId.id}/${id}`)
            return data
        },
        select: (data) => {
            return data
        }
    })

    const mutation=useMutation({
        mutationFn: async () => {
            try {
                const response = await axiosPrivate.post(`/github/commitRepo`, { projectid: projectId, userid: decoded.id})
                console.log('response: ', response)
            } catch (error) {
                console.log('error: ', error)
            }
        }
    })
    const handleLogout = async () => {
        await logout()
    }

        const handleCommit = () => {
        mutation.mutate()
    }
    return (
        <div style={{marginBottom: '30px'}}>
            <Card variant="outlined" sx={{width:400, height:40, backgroundColor: "#002c2b", alignContent: 'center', marginBottom: '10px'}}>
                <div style={{ flexDirection:'row', display:"flex", alignContent:'center', alignItems:"center"}}>
                <AccountCircleIcon style={{color: "#ffbc11", fontSize: '40px'}}/>
                <span style={{color: "#fbffe3", fontSize: '16px', fontFamily: 'Arial'}}>{localStorage.getItem('email')}</span>
            </div>
            </Card>
        {collaborators.length > 0 && (
        <Card variant='outlined' sx={{width:400, height:60, backgroundColor: "#002c2b", alignContent: 'center'}}>
            <span style={{color: "#fbffe3", fontSize: '16px', fontFamily: 'Arial'}}>Collaborators: {collaborators.join(', ')} </span>
        </Card> )}

        <Button size="small" sx={{width:400,backgroundColor: "#002c2b", marginTop: '10px', color: "#ffbc11", fontSize: '16px', fontFamily: 'Arial'}} onClick={()=>handleLogout()} >Sign out</Button>
       {!readonly && git && <Button sx={{width:400,backgroundColor: "#002c2b", marginTop: '10px', color: "#fbffe3", fontSize: '16px', fontFamily: 'Arial'}} startIcon={<CommitIcon style={{color: "ffbc11"}}/>} onClick={()=>handleCommit()}>Commit to Github</Button>}
        </div>
    )
}