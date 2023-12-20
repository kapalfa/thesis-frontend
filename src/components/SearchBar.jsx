import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import Toolbar from '@mui/material/Toolbar';
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const searchProject = async (debouncedSearchInput) => {
  console.log("debouncedSearchInput", debouncedSearchInput)
  const { data } = await axios.get(`https://127.0.0.1:8443/api/searchProjects/${debouncedSearchInput}`)
  return data
}

function search(debouncedSearchInput){
  return useQuery({
    queryKey: ['search', debouncedSearchInput], 
    queryFn: () => searchProject(debouncedSearchInput),
    enabled: !!debouncedSearchInput, 
    //staleTime: 30000,
  })
}

export default function SearchAppBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchInput = useDebounce(searchInput, 1000)
  const { data, error, status} = search(debouncedSearchInput)
  const [ anchorEl, setAnchorEl ] = useState(null)
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (status === 'success') console.log(data)
  if (error) console.log("errror"  , error)
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchInputChange}
              onClick={handleClick}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              aria-controls={open ? 'basic-menu' : undefined}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {data?.map((project) => (
                <MenuItem key={project.id} onClick={() => {navigate(`/project/${project.id}`, {state: { project: project }}); handleClose()}}>{project.name}</MenuItem>
              ))}
            </Menu>
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}