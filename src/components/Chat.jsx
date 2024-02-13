import useAuth from "../hooks/useAuth"
import { jwtDecode } from "jwt-decode"
import useWebSocket from "react-use-websocket"
import 'react-chat-elements/dist/main.css'
import { useState } from "react"
import { useParams } from "react-router-dom"
import { MessageBox } from 'react-chat-elements'
import { Avatar } from 'react-chat-elements'
import TextField from "@mui/material/TextField"
import { API_WS_URL } from "../api/axios"

export default function Chat(){
    const { id } = useParams()
    const [ messageInput, setMessageInput ] = useState('')
    const [ messages, setMessages ] = useState([])
    const { auth } = useAuth()
    const userid = jwtDecode(auth).id
   
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
    const { sendMessage, lastMessage, getWebSocket } = useWebSocket(socketURL, {
        onOpen: () => sendMessage(JSON.stringify(InitialMessage)),
        onMessage: (messageEvent) => { 
            const messageObject = JSON.parse(messageEvent.data)
            const messageContent = messageObject.message
            const messageSender = messageObject.senderId
            const messageEmail = messageObject.email
            const liveUsers = messageObject.liveUsers
            console.log("liveUsers: ", liveUsers)
            setMessages((prevMessages) => [...prevMessages, {id : messageSender, message: messageContent, email: messageEmail, liveUsers}])},
        //retryOnError: true,
        //shouldReconnect: (closeEvent) => true,
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
            <div style={{ height: 387, marginRight: '50px', backgroundColor: "#002c2b" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ alignItems: 'center' }}>
                        <MessageBox position={'center'} type={'text'} text={`${msg.liveUsers} users are online`} />     
                        {msg.id === String(userid) ? '' : <Avatar src='https://avatar.vercel.sh/rauchg.svg' />}
                        <MessageBox
                            title={msg.email}
                            position={msg.id === String(userid) ? "right" : "left"}
                            type={'text'}
                            text={msg.message}
                        />
                    </div> 
                ))}
            </div>
            <TextField value={messageInput} label="Chat with the collaborators of the project" variant="outlined" multiline rows={2} style={{ width: 620, backgroundColor: "#076461" }} size="small" onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { handleKeyDown(e) }} />
        </>
    )
}