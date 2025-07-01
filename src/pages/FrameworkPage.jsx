import React, { useState, useRef, useEffect } from 'react';
import { Typography, Container, Button, List, ListItem, ListItemButton, ListItemText, Box, Collapse, ListItemIcon, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import docs from '../data';
import StepNavSidebar from '../components/StepNavSidebar';
import StepBlock from '../components/StepBlock';

function FrameworkPage({ framework }) {
  const modules = docs[framework]?.modules || [];
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [flatIdx, setFlatIdx] = useState(0);
  const stepRefs = useRef([]);

  // Build a flat list of all modules and submodules
  const flatList = React.useMemo(() => {
    const list = [];
    modules.forEach((mod, mIdx) => {
      list.push({ type: 'module', moduleIdx: mIdx, submoduleIdx: null, name: mod.name });
      if (mod.submodules && mod.submodules.length > 0) {
        mod.submodules.forEach((sub, sIdx) => {
          list.push({ type: 'submodule', moduleIdx: mIdx, submoduleIdx: sIdx, name: sub.name });
        });
      }
    });
    return list;
  }, [modules]);

  // Get current selection
  const current = flatList[flatIdx] || {};
  const selectedModuleIdx = current.moduleIdx ?? 0;
  const selectedSubmoduleIdx = current.submoduleIdx;
  const selectedModule = modules[selectedModuleIdx] || null;
  const selectedSubmodules = selectedModule?.submodules || [];
  const stepList = selectedSubmoduleIdx != null
    ? selectedSubmodules[selectedSubmoduleIdx]?.steps || []
    : selectedModule?.steps || [];

  // When framework changes, reset flatIdx
  useEffect(() => {
    setFlatIdx(0);
  }, [framework]);

  // Scroll to top of content on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [flatIdx]);

  const handleDropdown = (e, idx) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  useEffect(() => {
    if (stepRefs.current[selectedSubmoduleIdx]) {
      stepRefs.current[selectedSubmoduleIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSubmoduleIdx]);

  // Build tree for sidebar: module steps + submodules and their steps
  const sidebarTree = React.useMemo(() => {
    const tree = [];
    // Add module steps
    if (selectedModule?.steps) {
      selectedModule.steps.forEach((step, idx) => {
        tree.push({
          type: 'moduleStep',
          label: `Step ${idx + 1}: ${step.title}`,
          stepIdx: idx,
          submoduleIdx: null,
        });
      });
    }
    // Add submodules and their steps
    if (selectedModule?.submodules) {
      selectedModule.submodules.forEach((sub, sIdx) => {
        const subSteps = (sub.steps || []).map((step, stIdx) => ({
          type: 'submoduleStep',
          label: `Step ${stIdx + 1}: ${step.title}`,
          stepIdx: stIdx,
          submoduleIdx: sIdx,
        }));
        tree.push({
          type: 'submodule',
          label: sub.name,
          submoduleIdx: sIdx,
          steps: subSteps,
        });
      });
    }
    return tree;
  }, [selectedModule]);

  // Handler to scroll to a step in main content and update selection
  const handleStepNav = (submoduleIdx, stepIdx) => {
    // Find the flatIdx for the module or submodule
    let newFlatIdx;
    if (submoduleIdx == null) {
      newFlatIdx = flatList.findIndex(item => item.type === 'module' && item.moduleIdx === selectedModuleIdx);
    } else {
      newFlatIdx = flatList.findIndex(item => item.type === 'submodule' && item.moduleIdx === selectedModuleIdx && item.submoduleIdx === submoduleIdx);
    }
    if (newFlatIdx !== -1) {
      setFlatIdx(newFlatIdx);
      // Scroll to top of content after selection
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Sidebar */}
      {showLeftSidebar && (
        <div style={{ width: 260, background: '#f5f5f5', borderRight: '1px solid #ddd', position: 'relative' }}>
          <button
            style={{ position: 'absolute', top: 8, right: 8, zIndex: 1100 }}
            onClick={() => setShowLeftSidebar(false)}
            aria-label="Hide left sidebar"
          >
            &#10005;
          </button>
          <Box display="flex" justifyContent="center">
            <List sx={{ width: 360, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
              {modules.map((mod, idx) => (
                <React.Fragment key={mod.name}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                      // Find the flatIdx for this module
                      const flatIdxForModule = flatList.findIndex(item => item.type === 'module' && item.moduleIdx === idx);
                      setFlatIdx(flatIdxForModule);
                    }} selected={current.type === 'module' && current.moduleIdx === idx}>
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
                              onClick={() => {
                                // Find the flatIdx for this submodule
                                const flatIdxForSub = flatList.findIndex(item => item.type === 'submodule' && item.moduleIdx === idx && item.submoduleIdx === sIdx);
                                setFlatIdx(flatIdxForSub);
                              }}
                              selected={current.type === 'submodule' && current.moduleIdx === idx && current.submoduleIdx === sIdx}
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
        </div>
      )}
      {/* Hamburger to show left sidebar */}
      {!showLeftSidebar && (
        <div style={{ position: 'sticky', top: 67, zIndex: 1200, pointerEvents: 'none', marginLeft: 8 }}>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}
            onClick={() => setShowLeftSidebar(true)}
            aria-label="Show left sidebar"
          >
            &#9776;
          </button>
        </div>
      )}
      {/* Main Content */}
      <div style={{ flex: 1, padding: 32, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Hamburger to show right sidebar */}
        {!showRightSidebar && (
          <button
            style={{
              position: 'fixed',
              top: 67,
              right: 16,
              zIndex: 1300,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid #ddd',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}
            onClick={() => setShowRightSidebar(true)}
            aria-label="Show right sidebar"
          >
            &#9776;
          </button>
        )}
        {/* Render main content: only selected module or submodule steps */}
        {current.type === 'module' && selectedModule?.steps && selectedModule.steps.map((step, stepIdx) => (
          <div
            key={`mod-step-${stepIdx}`}
            style={{ marginBottom: 32 }}
          >
            <Typography variant="h6" gutterBottom>
              {`Step ${stepIdx + 1}: ${step.title}`}
            </Typography>
            {step.blocks && step.blocks.map((block, blockIdx) => (
              <StepBlock block={block} key={blockIdx} />
            ))}
          </div>
        ))}
        {current.type === 'submodule' && selectedModule?.submodules && selectedModule.submodules[selectedSubmoduleIdx]?.steps &&
          selectedModule.submodules[selectedSubmoduleIdx].steps.map((step, stIdx) => (
            <div
              key={`sub-${selectedSubmoduleIdx}-step-${stIdx}`}
              style={{ marginBottom: 32 }}
            >
              <Typography variant="h6" gutterBottom>
                {`${selectedModule.submodules[selectedSubmoduleIdx].name} - Step ${stIdx + 1}: ${step.title}`}
              </Typography>
              {step.blocks && step.blocks.map((block, blockIdx) => (
                <StepBlock block={block} key={blockIdx} />
              ))}
            </div>
          ))}
        {/* Next/Prev Navigation */}
        {flatList.length > 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4} mb={2} gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFlatIdx(idx => Math.max(0, idx - 1))}
              disabled={flatIdx === 0}
            >
              {flatIdx > 0 ? `Previous: ${flatList[flatIdx - 1].name}` : 'Previous'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFlatIdx(idx => Math.min(flatList.length - 1, idx + 1))}
              disabled={flatIdx === flatList.length - 1}
            >
              {flatIdx < flatList.length - 1 ? `Next: ${flatList[flatIdx + 1].name}` : 'Next'}
            </Button>
          </Box>
        )}
      </div>
      {/* Right Sidebar */}
      {showRightSidebar && (
        <div style={{ width: 260, background: '#f5f5f5', borderLeft: '1px solid #ddd', position: 'relative', minHeight: '100vh' }}>
          <StepNavSidebar
            moduleName={selectedModule?.name}
            sidebarTree={sidebarTree}
            onStepNav={handleStepNav}
            topOffset={64}
            onClose={() => setShowRightSidebar(false)}
            onToggleLeftSidebar={() => setShowLeftSidebar(v => !v)}
          />
        </div>
      )}
    </div>
  );
}

export default FrameworkPage;