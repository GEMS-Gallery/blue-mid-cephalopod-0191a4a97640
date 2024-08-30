import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EvStationIcon from '@mui/icons-material/EvStation';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  left: 240,
  width: 'calc(100% - 240px)',
  [theme.breakpoints.down('md')]: {
    left: 60,
    width: 'calc(100% - 60px)',
  },
}));

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <EvStationIcon fontSize="large" style={{ marginRight: '16px' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cycle Refill Station
        </Typography>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
