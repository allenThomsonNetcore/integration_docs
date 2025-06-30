import React, { useState } from 'react';
import { Typography, Container, Button, List, ListItem, ListItemButton, ListItemText, Box, Collapse, ListItemIcon, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import docs from '../docsData';

function FrameworkPage({ framework }) {
  const modules = docs[framework]?.modules || [];
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdown = (e, idx) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        {framework.charAt(0).toUpperCase() + framework.slice(1)} Integration
      </Typography>
      {modules.length > 0 ? (
        <>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 4, display: 'block', mx: 'auto' }}
            onClick={() => navigate(`/${framework}/module/0`)}
          >
            Start with {modules[0].name}
          </Button>
          <Box display="flex" justifyContent="center">
            <List sx={{ width: 360, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
              {modules.map((mod, idx) => (
                <React.Fragment key={mod.name}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate(`/${framework}/module/${idx}`)}>
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
          </Box>
        </>
      ) : (
        <Typography align="center">No modules available for this framework yet.</Typography>
      )}
    </Container>
  );
}
export default FrameworkPage; 