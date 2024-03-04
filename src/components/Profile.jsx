import React from 'react'
import { useState } from 'react'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Logout from './AuthComponents/Logout.jsx'
import Button from '@mui/material/Button'
import { createTheme, Dialog, DialogContent, ListItem, ThemeProvider } from '@mui/material'
import getInvitations from './InvitationList.jsx'
import Invitation from './Invitation.jsx'
import { DialogActions } from '@mui/material'
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import List from '@mui/material/List'
import Card from '@mui/material/Card'

const defaultTheme = createTheme()
export default function Profile () {
    const [anchorEl, setAnchorEl] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const open = Boolean(anchorEl)
    const { status, data:invitations, error } = getInvitations()
    if (error) {
        console.log('An error has occurred: ' + error.message)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleInvitationClick = () => {
        setOpenDialog(true)
    }
    const handleDialogClose = () => {
        setOpenDialog(false)
    }
    return (
        <div>   
            <Button 
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="success"
                >
                <AccountCircleRoundedIcon/>
            </Button>
            <ThemeProvider theme={defaultTheme}>
            <Menu 
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem> <AccountCircleRoundedIcon/> 
                {localStorage.getItem('email')}</MenuItem>
               
                {status === 'success' && invitations && invitations.length > 0 &&
                    <MenuItem onClick={()=>handleInvitationClick()}><NewReleasesIcon/> Invitations </MenuItem>
                }
                <MenuItem onClick={handleClose}> <Logout/> </MenuItem>
            </Menu>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogContent>
                    <List>
                    {invitations && invitations.map(({id, name, description, collaborators}) => (
                        <ListItem>
                        <Card>
                        <Invitation id={id} name={name} description={description} collaborators={collaborators} handleDialogClose={handleDialogClose}/>
                        </Card>
                        </ListItem>
                    ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions> 
            </Dialog>
            </ThemeProvider>
        </div>
    )
}