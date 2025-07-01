import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Box, Collapse, useTheme, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function StepNavSidebar({
  moduleName,
  sidebarTree = [],
  onStepNav,
  topOffset = 64, // px, adjust if your nav bar is a different height
  onClose,
  onToggleLeftSidebar
}) {
  const theme = useTheme();
  if (!moduleName) return null;

  const [openSub, setOpenSub] = React.useState(null);

  return (
    <Box sx={{
      width: 260,
      position: 'relative',
      bgcolor: theme.palette.background.default,
      borderLeft: 1,
      borderColor: 'divider',
      overflowY: 'auto',
      p: 2,
      boxSizing: 'border-box',
      mt: 1,
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, mt: 0.5 }}>
        <IconButton size="small" onClick={onClose} aria-label="Close right sidebar">
          <CloseIcon />
        </IconButton>
      </Stack>
      <List sx={{ p: 0 }}>
        {/* Module Title */}
        <ListItem sx={{
          bgcolor: theme.palette.grey[100],
          borderRadius: 2,
          mb: 1,
          px: 2,
        }}>
          <ListItemText primary={moduleName} primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItem>
        {/* Tree view: module steps and submodules/steps */}
        {sidebarTree.map((item, idx) => {
          if (item.type === 'moduleStep') {
            return (
              <ListItem key={item.label} disablePadding sx={{ pl: 2, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => onStepNav(null, item.stepIdx)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          }
          if (item.type === 'submodule') {
            return (
              <React.Fragment key={item.label}>
                <ListItem disablePadding sx={{ pl: 1, mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => setOpenSub(openSub === idx ? null : idx)}
                  >
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 'bold' }} />
                    <IconButton size="small">
                      <ExpandMoreIcon
                        sx={{
                          transform: openSub === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
                <Collapse in={openSub === idx} timeout="auto" unmountOnExit>
                  {item.steps.map(subStep => (
                    <ListItem key={subStep.label} disablePadding sx={{ pl: 4, mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => onStepNav(item.submoduleIdx, subStep.stepIdx)}
                      >
                        <ListItemText primary={subStep.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Collapse>
              </React.Fragment>
            );
          }
          return null;
        })}
      </List>
    </Box>
  );
}

export default StepNavSidebar; 