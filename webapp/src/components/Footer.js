import * as React from 'react';
import { AppBar, Toolbar, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AndroidIcon from '@mui/icons-material/Android';

const Footer = () => {
    const { t } = useTranslation();

    return (
      <AppBar component="footer" position="static" sx={{ backgroundColor: "primary", color: "white", bottom: 0, left: 0, width: '100%', zIndex: 1000}}>
        <Toolbar>
          <Typography sx={{ margin: 'auto' }}>
            <Link href='https://app.swaggerhub.com/apis-docs/UO288347_1/questions-api/1.0.0' target="_blank" color="inherit">
              {t("Footer.api_questions")}
            </Link>
          </Typography>
          <Typography sx={{ margin: 'auto' }}>
            <Link href="https://github.com/Arquisoft/wiq_es04a" target="_blank" rel="noopener" color="inherit">© WIQ-ES04A</Link>
          </Typography>
          <Typography sx={{ margin: 'auto' }}>
            <Link href='https://app.swaggerhub.com/apis-docs/UO289689_1/users-api/1.0.0' target="_blank" color="inherit">
              {t("Footer.api_users")}
            </Link>
          </Typography>
          <a
            href="https://mega.nz/file/vNVkhQwT#l3K-nttaNWJ1tjdUVXJlCClmYm9rmpgBS_ULNewASL4"
            target="_blank"
            rel="noopener noreferrer"
          >
          <button style={{ display: 'flex', alignItems: 'center' }}>
            <AndroidIcon style={{ marginRight: '8px' }} />
            Descargar para Android
          </button>
          </a>
        </Toolbar>
      </AppBar>
    );
};

export default Footer;