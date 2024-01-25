import React, { useEffect, useRef } from 'react'
import { Terminal } from "xterm"
import useWebSocket from 'react-use-websocket'
import '../xterm.css'
import { useParams } from 'react-router-dom'

let term 
function Shell() {
    const { id } = useParams()
    const socketURL = 'wss://localhost:8443/sockets'
    const { sendMessage, lastMessage, getWebSocket } = useWebSocket(socketURL, {
        onOpen: () => { openInitTerminal(), runTerminal() },
        retryOnError: true,
        shouldReconnect: (closeEvent) => true,
        onClose: () => {console.log('close'); getWebSocket().close()},
    })
    const termRef = useRef(null);

    const openInitTerminal = () => {
        term = new Terminal();
        const terminalContainer = document.getElementById("terminal");
        term.open(terminalContainer);
        term.focus();
        term.attachCustomKeyEventHandler((e) => handleKeyBinding(e))
    }

    const runTerminal = () => {
        if (term._initialized) {
            return;
        }
        term._initialized = true;
        term.prompt = () => {
            term.write('\r\n$ ');
        };
        
        term.writeln('Welcome to xterm.js');
        term.writeln('');
        term.prompt();
        term.onKey((e) => {
            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        
            if (ev.keyCode === 13) {
                const currentLine = term.buffer.active.getLine(term.buffer.active.cursorY)
                if(currentLine) {
                    const lineContent = currentLine.translateToString(true).replace(/^\$/, '')
                    let message = {lineContent, id}
                    sendMessage(JSON.stringify(message))
                }
                term.write('\n\r')
            } else if (ev.keyCode === 8) {
              // Do not delete the prompt
              if (term._core.buffer.x > 2) {
                term.write('\b \b');
              }
            } else if (printable) {
              term.write(e.key);
            }
        });
    }
    
    useEffect(() => {
        if(lastMessage?.data) {
            if(lastMessage.data === 'No output') {
                term.prompt()
                return
            }
            term.write(lastMessage.data)
            term.prompt()
        }
    }, [lastMessage])

    const iscopy = e => { return e.key === 'c' && e.ctrlKey === true && e.shiftKey === false && e.altKey === false }
    const ispaste = e => { return e.key === 'v' && e.ctrlKey === true && e.shiftKey === false && e.altKey === false }
    const issubmit = e => { return e.key === '\r' && e.ctrlKey === false && e.shiftKey === false && e.altKey === false }
    const handleKeyBinding = (e) => {
        if(issubmit(e) && e.type=='keyup'){
            sendMessage(term._core.buffer.translateBufferLines(true).getLines().join('\n'))
            term.write('\n\r')
            return false
        }
        if( ispaste(e) && e.type=='keyup'){
            navigator.clipboard.readText().then(
            clipText => term.write(clipText))
            return false       
        }
        return e 
    }

    useEffect(() => {
        return () => {
            term.dispose()
        }
    }, [])
  
    return <>
    DAFAK
    <div id="terminal" ref={termRef} />
    </>
}

export default Shell;