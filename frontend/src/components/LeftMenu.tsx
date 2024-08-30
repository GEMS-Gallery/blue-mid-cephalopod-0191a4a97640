import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import EvStationIcon from '@mui/icons-material/EvStation';
import CodeIcon from '@mui/icons-material/Code';

const StyledMenu = styled('div')(({ theme }) => ({
  width: 240,
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: {
    width: 60,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderLeft: '3px solid transparent',
  '&:hover, &.active': {
    backgroundColor: theme.palette.action.hover,
    borderLeftColor: theme.palette.primary.main,
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const LeftMenu: React.FC = () => {
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/' },
    { text: 'Refill Cycles', icon: <EvStationIcon />, link: '/refill' },
    { text: 'Start Building', icon: <CodeIcon />, link: 'https://beta.gems.fr1-dmz1.dfinity.network/' },
  ];

  return (
    <StyledMenu>
      <List>
        {menuItems.map((item, index) => (
          <StyledListItem
            button
            key={index}
            component="a"
            href={item.link}
            target={item.link.startsWith('http') ? '_blank' : '_self'}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <StyledListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
    </StyledMenu>
  );
};

export default LeftMenu;
