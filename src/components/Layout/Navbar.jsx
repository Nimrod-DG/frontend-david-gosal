import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Switch, FormControlLabel,} from '@mui/material'
import {AccountCircle, Dashboard, Assignment, Logout, DarkMode,LightMode,} from '@mui/icons-material'
import { logout } from '../../store/slices/authSlice'
import { toggleTheme } from '../../store/slices/themeSlice';

const Navbar = () => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { darkMode } = useSelector((state) => state.theme)
  const [anchorEl, setAnchorEl] = useState(null)
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleClose()
    navigate('/login')
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const isActive = (path) => location.pathname === path

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Frontend Test App
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<Assignment />}
            onClick={() => navigate('/form')}
            sx={{
              backgroundColor: isActive('/form') ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            Form
          </Button>

          <FormControlLabel
            control={
              <Switch
            checked={mode === 'dark'}
            onChange={() => dispatch(toggleTheme())}
            icon={<LightMode />}
            checkedIcon={<DarkMode />}
          />
            }
            label=""
          />

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar