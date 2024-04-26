import * as React from 'react';
import { useContext } from 'react';
import { AppBar, Toolbar, Menu, MenuItem, Box, Button, IconButton, Typography, Avatar, Select } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import TranslateIcon from '@mui/icons-material/Translate';
import { Link,useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { username, isLoggedIn, avatar, destroySession } = useContext(SessionContext);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    navigate('/');
    destroySession();
  };

  // Internacionalization ---
  const [lang, setLang] = React.useState(["en", "es"].includes(i18n.language) ? i18n.language : "en");
  const { t } = useTranslation();

  const handleChangeLang = (newLang) => {
    setLang(newLang);
  };

  React.useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  // ---

  // List of site pages for the menu. We have to address if it wouldnt be more consistent to extract this to a fragment / global const as it could be used outside.
  // Also as the element added is subjected to internazionalization, so we ll have to address it
  const pages = [
    // Inicio not appearing as WIQ logo is used for that
    { path: '/homepage', text: t("NavBar.play") },
    { path: '/statistics', text: t("NavBar.statistics") },
    { path: '/instructions', text: t("NavBar.instructions") },
    { path: '/group/menu', text: t("NavBar.groups") },
    { path: '/ranking', text: t("NavBar.ranking") }
    // Add an object for each new page
  ];

  const logo = (
    <Button component={Link} to="/" sx={{'&:hover': { backgroundColor: '#5f7e94' },}}>
      <img src="/white_logo.png" alt="Logo" style={{ height: 40 }} />
    </Button>
  )

  return (
    // position="static" => Barra se desplaza con scroll down
    <AppBar position="static" >
      {/* disableGutters -> Remove toolbar's padding */}
      <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Menú de Navegación, sólo se muestra en dispositivos móviles */}

        {isLoggedIn ? (
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
                    <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit', justifyContent:'center' }}>
                      <Typography textAlign="center">{page.text}</Typography>
                    </Link>
                  </MenuItem>
                ))}
            </Menu>
            { logo }
          </Box>
        ):(
          { logo }
        )}
        
        
        {/* Pages list in NavBar, only displayed when menu button is not, i.e., in larger devices */}
        {isLoggedIn ? (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems:'center' }}>
            { logo }
            <Box sx={{ display: 'fles', flexGrow: 1 }}>
              {pages.map((page) => (
                <Button component={Link} to={page.path==='/statistics'? `/statistics/${username}`:page.path} key={page.path} sx={{ color: 'white', display: 'block','&:hover': { backgroundColor: '#5f7e94' },}}>
                  {page.text}
                </Button>
              ))}
            </Box>
          </Box>
        ):(
          <Box></Box>
        )}

        <Box sx={{ display: "flex", gap: "2em" }}>
          {/* Internacionalization */}
          <Box sx={{ borderRadius: '0.5em', '&:hover': { backgroundColor: '#5f7e94' }}}>
            <TranslateIcon />
            <Select value={lang} autoWidth onChange={(e) => handleChangeLang(e.target.value)} data-testid="select-lang"
                    sx={{ color: 'white', boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }} >
              <MenuItem value={"en"} data-testid="en_selector">{t("NavBar.languages.en")}</MenuItem>
              <MenuItem value={"es"} data-testid="es_selector">{t("NavBar.languages.es")}</MenuItem>
              <MenuItem value={"fr"} data-testid="fr_selector">{t("NavBar.languages.fr")}</MenuItem>
            </Select>
          </Box>

          {isLoggedIn ? (
            <Box sx={{ display:'flex', alignItems:'center' }}>
              <Button component={Link} to="/profile" sx={{ p: 0, display: 'flex', alignItems: 'center', flexGrow: 0, '&:hover': { backgroundColor: '#5f7e94' }}} >
                <Typography variant="body2" sx={{ color: 'white', textDecoration: 'none', paddingLeft:'0.5em' }}>
                  {username}
                </Typography>
                <IconButton>
                  <Avatar src={avatar} alt="Profile pic" sx={{ width: 33, height: 33 }} />
                </IconButton>
              </Button>
              <IconButton onClick={handleLogout} sx={{ color: 'white', '&:hover': { backgroundColor: '#5f7e94' }}} data-testid="logout-button">
                <LogoutIcon />
              </IconButton>
            </Box>
          ):(
            <Button component={Link} to={'/login'} sx={{ p: 0, display: 'flex', alignItems: 'center', flexGrow: 0, '&:hover': { backgroundColor: '#5f7e94' }}} >
              <Typography variant="body2" sx={{ color: 'white', textDecoration: 'none', paddingLeft:'0.5em' }}>
                Log In
              </Typography>
              <IconButton >
                <Avatar src="/default_user.jpg" alt="Profile pic" sx={{ width: 33, height: 33 }} />
              </IconButton>
            </Button>
          )}        
          </Box>
      </Toolbar>
  </AppBar>
  );
}
export default NavBar;