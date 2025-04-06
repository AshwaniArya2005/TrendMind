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

const NavLink = styled(RouterLink)(({ theme }) => ({
  color: 'white',
  marginLeft: theme.spacing(3),
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  border: '1px solid white',
  color: 'white',
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/login">
                  Log In
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/register">
                  Register
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/faq">FAQ</NavLink>
                <NavLink to="/about">About Us</NavLink>
              </Box>
              <Box>
                <LoginButton variant="outlined" component={RouterLink} to="/login">
                  Log In
                </LoginButton>
                <RegisterButton variant="contained" component={RouterLink} to="/register">
                  Register
                </RegisterButton>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 