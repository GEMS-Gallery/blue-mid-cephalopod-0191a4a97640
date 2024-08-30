import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import EvStationIcon from '@mui/icons-material/EvStation';
import DiamondIcon from '@mui/icons-material/Diamond';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: theme.palette.background.default,
  },
}));

interface LeftMenuProps {
  open: boolean;
  onClose: () => void;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ open, onClose }) => {
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/' },
    { text: 'Refill Cycles', icon: <EvStationIcon />, link: '/refill' },
    { text: 'GEMS', icon: <DiamondIcon />, link: 'https://beta.gems.fr1-dmz1.dfinity.network/' },
    { text: 'Start Building', icon: <CodeIcon />, link: '/start-building' },
  ];

  return (
    <StyledDrawer anchor="left" open={open} onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} component="a" href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default LeftMenu;
