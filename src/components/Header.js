import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

const NavLink = styled(RouterLink)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(4),
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  '&:hover': {
    textDecoration: 'none',
    opacity: 0.85,
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  color: 'white',
  marginLeft: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '4px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'white',
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '4px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: theme.palette.primary.main,
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.5rem',
            }}
          >
            TrendMind
          </Typography>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: '45px' }}
              >
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/">
                  Home
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/discover">
                  Discover
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/faq">
                  FAQ
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/about">
                  About Us
                </MenuItem>
                {!isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/login">
                      Log In
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/register">
                      Register
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                    My Profile
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/faq">FAQ</NavLink>
                <NavLink to="/about">About Us</NavLink>
              </Box>
              <Box>
                {!isAuthenticated ? (
                  <>
                    <LoginButton variant="outlined" component={RouterLink} to="/login">
                      Log In
                    </LoginButton>
                    <RegisterButton variant="contained" component={RouterLink} to="/register">
                      Register
                    </RegisterButton>
                  </>
                ) : (
                  <UserMenu />
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 