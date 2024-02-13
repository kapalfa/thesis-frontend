import * as React from 'react';
import Button from '@mui/material/Button';
import useLogout from '../../hooks/useLogout';
export default function Logout() {
    const logout = useLogout()
    const handleLogout = async () => {
      await logout()
    }
  return (
    <Button fullWidth variant="contained" onClick={()=>handleLogout()}>Log Out</Button>
  )
}