import useAuth from "../hooks/useAuth"
import React from "react"
import { jwtDecode } from "jwt-decode"
import useWebSocket from "react-use-websocket"
import 'react-chat-elements/dist/main.css'
import { useState } from "react"
import { useParams } from "react-router-dom"
import { MessageBox } from 'react-chat-elements'
import TextField from "@mui/material/TextField"
import Box from '@mui/material/Box'
import { API_WS_URL } from "../api/axios"
import useGetCollaborators from "../hooks/useGetCollaborators"
import styled from "styled-components"
const StyledMessageBox = styled(MessageBox)`
    background-color: ${props => props.sentByCurrentUser ? "#fbffe3" : "#d6a692"};
`
export default function Chat(){
    const { id } = useParams()
    const [ messageInput, setMessageInput ] = useState('')
    const [ messages, setMessages ] = useState([])
    const { auth } = useAuth()
    const userid = jwtDecode(auth).id
    const { data: collaborators } = useGetCollaborators(id, userid)
   
    const socketURL = `${API_WS_URL}/sockets/chat/${userid}`
    let InitialMessage = {
        action: 'joinRoom',
        message: '',
        roomId: id,
        senderId: String(userid)
    }

    let FinalMessage = {
        action: 'leaveRoom',
        message: '',
        roomId: id,
        senderId: String(userid)
    }
    const { sendMessage, getWebSocket } = useWebSocket(socketURL, {
        onOpen: () => sendMessage(JSON.stringify(InitialMessage)),
        onMessage: (messageEvent) => { 
            const messageObject = JSON.parse(messageEvent.data)
            const messageContent = messageObject.message
            const messageSender = messageObject.senderId
            const messageEmail = messageObject.email
            setMessages((prevMessages) => [...prevMessages, {id : messageSender, message: messageContent, email: messageEmail}])},
        onClose: () => {sendMessage(JSON.stringify(FinalMessage)); setTimeout(()=>getWebSocket(), 5000)},
    })
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (messageInput) {
                let message = {
                    action: 'sendMessage',
                    message: messageInput,
                    roomId: id,
                    senderId: String(userid)
                }
                sendMessage(JSON.stringify(message))
                setMessageInput('')
            }
        }
    }
    return (
        <>
        {collaborators && collaborators.length > 0 && (
        <Box style={{width:'510px'}}> 
            <div style={{ height: 387, marginRight: '100px', backgroundColor: "#292522", width:'100%', overflowY: 'auto'}}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <StyledMessageBox
                            title={msg.email}
                            position={msg.id === String(userid) ? "right" : "left"}
                            type={'text'}
                            text={msg.message}
                            sentByCurrentUser={msg.id === String(userid)} 
                        />
                    </div> 
                ))}
            </div>
            <TextField value={messageInput} label="Chat with the collaborators of the project" variant="outlined" multiline rows={2} style={{ width: '100%' }} size="small" onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { handleKeyDown(e) }} />
        </Box>
        )}
        </>
    )
}