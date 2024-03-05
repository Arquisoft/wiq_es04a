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

function NavBar() {
  // Width for the nav menu element (?) Is it used later as a boolean ??????
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { sessionId, username, isLoggedIn, createSession, destroySession } = useContext(SessionContext);

  return (
    // position="static" => Barra se desplaza con scroll down
    <AppBar position="static" >
    {/* The Container component is used to limit the maximum width of the content inside the AppBar. It ensures that the content doesn't extend too far horizontally. */}
    {/* <Container maxWidth="xl"> */}
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
        <Button component={Link} to="/" sx={{'&:hover': { backgroundColor: '#5f7e94'},}}>
            <img src="/white_logo.png" alt="Logo" style={{ height: 40 }} />
        </Button>
        {/* Pages list in NavBar, only displayed when menu button is not, i.e., in larger devices */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button component={Link} to={page.path} key={page.path} sx={{ color: 'white', display: 'block','&:hover': { backgroundColor: '#5f7e94',  },}}>
            {page.text}
        </Button>
          ))}
        </Box>
        {/* Pending: auth depending: if not auth: log in else: menu */}
        
        <Button component={Link} to={'/login'} sx={{ p: 0, display: 'flex', alignItems: 'center', flexGrow: 0, '&:hover': { backgroundColor: '#5f7e94',  }}} >
          <Typography variant="body2" sx={{ color: 'white', textDecoration: 'none' }}>
            {isLoggedIn ? `${username}` : "Log In"}
          </Typography>
          <IconButton >
            <Avatar src="/default_user.jpg" alt="Profile pic" sx={{ width: 33, height: 33 }} />
          </IconButton>
        </Button>
      </Toolbar>
    {/* </Container> */}
  </AppBar>
  );
}
export default NavBar;