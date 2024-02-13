import Chat from "./Chat"
import React, { useState } from "react"
import Button from "@mui/material/Button"

export default function ToggleChat() {
	const [showChat, setShowChat] = useState(false);
	return (
		
    <div
      style={{
        height: 387,
        marginRight: "50px",
        backgroundColor: "#002c2b",
      }}
    >
      {!showChat ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={() => setShowChat(true)}>
            Show Chat
          </Button>
        </div>
      ) : (
        <>
          <Button variant="contained" onClick={() => setShowChat(false)}>
            Hide Chat
          </Button>
          <Chat />
        </>
      )}
    </div>
  ) }