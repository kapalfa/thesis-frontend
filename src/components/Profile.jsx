import React from 'react'
import { useState } from 'react'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Logout from './AuthComponents/Logout.jsx'
import GithubLogin from './GithubComponents/GithubLogin.jsx'
import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material'
const defaultTheme = createTheme()
export default function Profile () {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
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
                <MenuItem onClick={handleClose}> <Logout/> </MenuItem>
            {/* <MenuItem onClick={handleClose}> <GithubLogin/> </MenuItem>*/}
            </Menu>
            </ThemeProvider>

        </div>
    )
}