import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Box, Collapse, ListItemIcon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';

function SidebarNav({ framework, modules, currentIdx, onClose, drawerWidth = 180 }) {
  const navigate = useNavigate();
  const { submoduleIdx } = useParams();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdown = (e, idx) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', position: 'relative' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1 }}>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {modules.map((mod, idx) => (
          <React.Fragment key={mod.name}>
            <ListItem disablePadding>
              <ListItemButton
                selected={idx === currentIdx && !submoduleIdx}
                onClick={() => navigate(`/${framework}/module/${idx}`)}
              >
                <ListItemText primary={mod.name} />
                {mod.submodules && (
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <IconButton
                      size="small"
                      onClick={e => handleDropdown(e, idx)}
                      edge="end"
                      tabIndex={-1}
                      aria-label={openDropdown === idx ? 'Collapse' : 'Expand'}
                    >
                      <ExpandMoreIcon
                        sx={{
                          transform: openDropdown === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </IconButton>
                  </ListItemIcon>
                )}
              </ListItemButton>
            </ListItem>
            {mod.submodules && (
              <Collapse in={openDropdown === idx} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {mod.submodules.map((sub, sIdx) => (
                    <ListItem key={sub.name} disablePadding sx={{ pl: 3 }}>
                      <ListItemButton
                        selected={idx === currentIdx && String(sIdx) === submoduleIdx}
                        onClick={() => navigate(`/${framework}/module/${idx}/submodule/${sIdx}`)}
                      >
                        <ListItemText primary={sub.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

export default SidebarNav; 