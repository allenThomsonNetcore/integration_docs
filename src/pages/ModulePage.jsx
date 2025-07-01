import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import ModuleList from '../components/ModuleList';
import SidebarNav from '../components/SidebarNav';
import docs from '../data';

const drawerWidth = 180;
const mainContentMargin = 80;

function ModulePage() {
  const { framework, moduleIdx, submoduleIdx } = useParams();
  const navigate = useNavigate();
  const modules = docs[framework]?.modules || [];
  const idx = parseInt(moduleIdx, 10);
  const module = modules[idx];
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Build a flat navigation list of modules and submodules
  const navList = [];
  modules.forEach((mod, mIdx) => {
    navList.push({
      type: 'module',
      moduleIdx: mIdx,
      name: mod.name,
      label: mod.name,
    });
    if (mod.submodules) {
      mod.submodules.forEach((sub, sIdx) => {
        navList.push({
          type: 'submodule',
          moduleIdx: mIdx,
          submoduleIdx: sIdx,
          name: sub.name,
          label: `${mod.name} / ${sub.name}`,
        });
      });
    }
  });

  // Find current position in navList
  let currentNavIdx = navList.findIndex(item => {
    if (submoduleIdx !== undefined) {
      return item.type === 'submodule' && String(item.moduleIdx) === moduleIdx && String(item.submoduleIdx) === submoduleIdx;
    } else {
      return item.type === 'module' && String(item.moduleIdx) === moduleIdx;
    }
  });

  const prevNav = currentNavIdx > 0 ? navList[currentNavIdx - 1] : null;
  const nextNav = currentNavIdx < navList.length - 1 ? navList[currentNavIdx + 1] : null;

  // Determine what to display
  let displayModules = [module];
  let displayTitle = `${framework.charAt(0).toUpperCase() + framework.slice(1)}: ${module?.name}`;
  if (submoduleIdx && module && module.submodules) {
    const subIdx = parseInt(submoduleIdx, 10);
    const submodule = module.submodules[subIdx];
    if (submodule) {
      displayModules = [submodule];
      displayTitle = `${framework.charAt(0).toUpperCase() + framework.slice(1)}: ${module.name} / ${submodule.name}`;
    }
  }

  if (!module) return <Typography>Module not found.</Typography>;

  // Navigation handlers
  const goToNav = nav => {
    if (nav.type === 'module') {
      navigate(`/${framework}/module/${nav.moduleIdx}`);
    } else if (nav.type === 'submodule') {
      navigate(`/${framework}/module/${nav.moduleIdx}/submodule/${nav.submoduleIdx}`);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {sidebarOpen && (
        <SidebarNav
          framework={framework}
          modules={modules}
          currentIdx={idx}
          onClose={() => setSidebarOpen(false)}
          drawerWidth={drawerWidth}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? `${mainContentMargin}px` : 0,
          p: 3,
          transition: 'margin-left 0.3s',
        }}
      >
        {!sidebarOpen && (
          <Button
            variant="contained"
            size="small"
            sx={{
              position: 'fixed',
              top: 80,
              left: 16,
              zIndex: 1301,
              minWidth: 0,
              borderRadius: '50%',
              p: 1,
            }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Show Sidebar"
          >
            {'≡'}
          </Button>
        )}
        <Container>
          <Typography variant="h4" gutterBottom>
            {displayTitle}
          </Typography>
          <ModuleList modules={displayModules} />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              disabled={!prevNav}
              onClick={() => prevNav && goToNav(prevNav)}
            >
              {prevNav ? `Prev: ${prevNav.label}` : 'Prev'}
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/${framework}`)}
            >
              Back to Framework
            </Button>
            <Button
              variant="contained"
              disabled={!nextNav}
              onClick={() => nextNav && goToNav(nextNav)}
            >
              {nextNav ? `Next: ${nextNav.label}` : 'Next'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default ModulePage;