import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Domain as DomainIcon,
  Extension as ExtensionIcon,
  Event as EventIcon,
  Apps as AppsIcon,
} from '@mui/icons-material';
import { ROUTES } from '../../utils/constants';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { text: 'Organizations', icon: <BusinessIcon />, path: ROUTES.ORGANIZATIONS },
  { text: 'Domains', icon: <DomainIcon />, path: ROUTES.DOMAINS },
  { text: 'Platforms', icon: <AppsIcon />, path: ROUTES.PLATFORMS },
  { text: 'Integrations', icon: <ExtensionIcon />, path: ROUTES.INTEGRATIONS },
  { text: 'Events', icon: <EventIcon />, path: ROUTES.EVENTS },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

