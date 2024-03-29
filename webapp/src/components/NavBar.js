import * as React from 'react';
import { useContext } from 'react';
import { AppBar, Toolbar, Menu, MenuItem, Box, Button, IconButton, Typography, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { SessionContext } from '../SessionContext';

// List of site pages for the menu. We have to address if it wouldnt be more consistent to extract this to a fragment / global const as it could be used outside.
// Also as the element added is subjected to internazionalization, so we ll have to address it
const pages = [
  // Inicio not appearing as WIQ logo is used for that
  { path: '/homepage', text: 'Play' },
  { path: '/statistics', text: 'Statistics' },
  { path: '/instructions', text: 'Instructions' },
  { path: '/group/list', text: 'List Groups' },
  { path: '/group/create', text: 'Create Group' },
  // Add an object for each new page
];

// Provisional settings menu for a logged user
const settings = [
  { path: '/profile', text: 'Perfil' },
  { path: '/', text: 'Cerrar Sesión' }
]

function NavBar() {
  // Width for the nav menu element (?) Is it used later as a boolean ??????
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);  
  const { username, isLoggedIn, destroySession } = useContext(SessionContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    destroySession();
  };

  return (
    // position="static" => Barra se desplaza con scroll down
    <AppBar position="static" >
      {/* disableGutters -> Remove toolbar's padding */}
      <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Menú de Navegación, sólo se muestra en dispositivos móviles */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }}}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar-pages"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar-pages"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
                <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                  <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">{page.text}</Typography>
                  </Link>
                </MenuItem>
              ))}
          </Menu>
        </Box>
        <Button component={Link} to="/" sx={{'&:hover': { backgroundColor: '#5f7e94' },}}>
            <img src="/white_logo.png" alt="Logo" style={{ height: 40 }} />
        </Button>
        
        
        {/* Pages list in NavBar, only displayed when menu button is not, i.e., in larger devices */}
        {isLoggedIn ? (
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button component={Link} to={page.path} key={page.path} sx={{ color: 'white', display: 'block','&:hover': { backgroundColor: '#5f7e94' },}}>
                {page.text}
              </Button>
            ))}
          </Box>
        ):(
          <Box></Box>
        )}


        {isLoggedIn ? (
          <Box>
            <Button onClick={handleOpenUserMenu} sx={{ p: 0, display: 'flex', alignItems: 'center', flexGrow: 0, '&:hover': { backgroundColor: '#5f7e94' }}} >
              <Typography variant="body2" sx={{ color: 'white', textDecoration: 'none' }}>
                {username}
              </Typography>
              <IconButton >
                {/* Need to change the image for the user profile one  */}
                <Avatar src="/default_user.jpg" alt="Profile pic" sx={{ width: 33, height: 33 }} />
              </IconButton>
            </Button>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (

                <MenuItem key={setting.path} onClick={setting.path==='/'? handleLogout:handleCloseUserMenu}>
                  <Link to={setting.path} style={{ textDecoration:'none', color:'inherit' }}>
                    <Typography textAlign="center">{setting.text}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ):(
          <Button component={Link} to={'/login'} sx={{ p: 0, display: 'flex', alignItems: 'center', flexGrow: 0, '&:hover': { backgroundColor: '#5f7e94' }}} >
            <Typography variant="body2" sx={{ color: 'white', textDecoration: 'none' }}>
              Log In
            </Typography>
            <IconButton >
              <Avatar src="/default_user.jpg" alt="Profile pic" sx={{ width: 33, height: 33 }} />
            </IconButton>
          </Button>
        )}        
      </Toolbar>
  </AppBar>
  );
}
export default NavBar;