import Shell from "./Shell"
import React, { useState } from "react"
import Button from "@mui/material/Button"

export default function ToggleChat() {
	const [showShell, setShowShell] = useState(false);
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
          <Button variant="contained" onClick={() => setShowShell(true)}>
            Show Shell
          </Button>
        </div>
      ) : (
        <>
          <Button variant="contained" onClick={() => setShowShell(false)}>
            Hide Shell
          </Button>
          <Shell />
        </>
      )}
    </div>
  ) }