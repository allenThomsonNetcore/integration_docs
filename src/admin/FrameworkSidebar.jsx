import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Collapse, ListItemIcon, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FrameworkSidebar({ selected, onSelect, docs }) {
  const [openDropdown, setOpenDropdown] = useState({});

  const handleDropdown = (e, framework, idx) => {
    e.stopPropagation();
    setOpenDropdown(prev => ({ ...prev, [`${framework}-${idx}`]: !prev[`${framework}-${idx}`] }));
  };

  return (
    <Box sx={{ width: 260, bgcolor: 'background.paper', height: '100vh', overflowY: 'auto', borderRight: 1, borderColor: 'divider' }}>
      <List>
        {Object.keys(docs).map(framework => (
          <React.Fragment key={framework}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selected.framework === framework && selected.moduleIdx == null}
                onClick={() => onSelect({ framework })}
              >
                <ListItemText primary={framework.charAt(0).toUpperCase() + framework.slice(1)} />
              </ListItemButton>
            </ListItem>
            {docs[framework].modules.map((mod, idx) => (
              <React.Fragment key={mod.name}>
                <ListItem disablePadding sx={{ pl: 2 }}>
                  <ListItemButton
                    selected={selected.framework === framework && selected.moduleIdx === idx && selected.submoduleIdx == null}
                    onClick={() => onSelect({ framework, moduleIdx: idx })}
                  >
                    <ListItemText primary={mod.name} />
                    {mod.submodules && (
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <IconButton
                          size="small"
                          onClick={e => handleDropdown(e, framework, idx)}
                          edge="end"
                          tabIndex={-1}
                          aria-label={openDropdown[`${framework}-${idx}`] ? 'Collapse' : 'Expand'}
                        >
                          <ExpandMoreIcon
                            sx={{
                              transform: openDropdown[`${framework}-${idx}`] ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </IconButton>
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                </ListItem>
                {mod.submodules && (
                  <Collapse in={openDropdown[`${framework}-${idx}`]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {mod.submodules.map((sub, sIdx) => (
                        <ListItem key={sub.name} disablePadding sx={{ pl: 4 }}>
                          <ListItemButton
                            selected={selected.framework === framework && selected.moduleIdx === idx && selected.submoduleIdx === sIdx}
                            onClick={() => onSelect({ framework, moduleIdx: idx, submoduleIdx: sIdx })}
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
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default FrameworkSidebar; 