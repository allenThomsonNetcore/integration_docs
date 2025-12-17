import React, { useState, useEffect, useCallback, useRef } from 'react';
import docs from '../data';
import FrameworkSidebar from './FrameworkSidebar';
import { Box, Button, TextField, IconButton, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, List, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StepNavSidebar from '../components/StepNavSidebar';
import Snackbar from '@mui/material/Snackbar';

const BLOCK_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'code', label: 'Code' },
  { value: 'image', label: 'Image' },
  { value: 'note', label: 'Note' },
  { value: 'gif', label: 'GIF' },
  { value: 'video', label: 'Video' },
];

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now();
}

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function BlockEditorFields({ block, onChange }) {
  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Block Type</InputLabel>
        <Select
          value={block.type || 'text'}
          label="Block Type"
          onChange={e => onChange('type', e.target.value)}
        >
          {BLOCK_TYPES.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {block.type === 'text' && (
        <TextField 
          label="Text (HTML allowed)" 
          fullWidth 
          multiline 
          minRows={2} 
          value={block.content || ''} 
          onChange={e => onChange('content', e.target.value)} 
        />
      )}
      {block.type === 'note' && (
        <TextField 
          label="Note" 
          fullWidth 
          multiline 
          minRows={2} 
          value={block.content || ''} 
          onChange={e => onChange('content', e.target.value)} 
        />
      )}
      {block.type === 'code' && (
        <Box sx={{ mb: 2 }}>
          {(block.languages || []).map((langBlock, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#FFF0EB' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <TextField
                  label="Language"
                  value={langBlock.lang || ''}
                  onChange={e => {
                    const newLangs = [...(block.languages || [])];
                    newLangs[idx] = { ...newLangs[idx], lang: e.target.value };
                    onChange('languages', newLangs);
                  }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Label (optional)"
                  value={langBlock.label || ''}
                  onChange={e => {
                    const newLangs = [...(block.languages || [])];
                    newLangs[idx] = { ...newLangs[idx], label: e.target.value };
                    onChange('languages', newLangs);
                  }}
                  sx={{ width: 140 }}
                />
                <Button
                  color="error"
                  size="small"
                  onClick={() => {
                    const newLangs = [...(block.languages || [])];
                    newLangs.splice(idx, 1);
                    onChange('languages', newLangs);
                  }}
                  sx={{ ml: 1 }}
                >
                  Remove
                </Button>
              </Stack>
              <TextField
                label="Code"
                fullWidth
                multiline
                minRows={2}
                value={langBlock.content || ''}
                onChange={e => {
                  const newLangs = [...(block.languages || [])];
                  newLangs[idx] = { ...newLangs[idx], content: e.target.value };
                  onChange('languages', newLangs);
                }}
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              const newLangs = [...(block.languages || [])];
              newLangs.push({ lang: '', label: '', content: '' });
              onChange('languages', newLangs);
            }}
            sx={{ mt: 1, background: '#FFF0EB', color: '#321B2D', fontWeight: 600, '&:hover': { background: '#f5d6cc' } }}
          >
            Add Language
          </Button>
        </Box>
      )}
      {block.type === 'code' && (!block.languages || block.languages.length === 0) && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Language"
            fullWidth
            value={block.language || ''}
            onChange={e => onChange('language', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Code"
            fullWidth
            multiline
            minRows={2}
            value={block.content || ''}
            onChange={e => onChange('content', e.target.value)}
          />
        </Box>
      )}
      {block.type === 'image' && (
        <>
          <TextField 
            label="Image URL" 
            fullWidth 
            value={block.url || ''} 
            onChange={e => onChange('url', e.target.value)} 
            sx={{ mb: 2 }} 
          />
          <TextField 
            label="Alt Text" 
            fullWidth 
            value={block.alt || ''} 
            onChange={e => onChange('alt', e.target.value)} 
          />
        </>
      )}
      {block.type === 'gif' && (
        <TextField 
          label="GIF URL" 
          fullWidth 
          value={block.url || ''} 
          onChange={e => onChange('url', e.target.value)} 
        />
      )}
      {block.type === 'video' && (
        <TextField 
          label="Video URL" 
          fullWidth 
          value={block.url || ''} 
          onChange={e => onChange('url', e.target.value)} 
        />
      )}
    </>
  );
}

function BlockDialog({ open, initialBlock, onSave, onCancel }) {
  const [block, setBlock] = useState(initialBlock);

  useEffect(() => {
    setBlock(initialBlock);
  }, [initialBlock, open]);

  const handleChange = useCallback((property, value) => {
    setBlock(prev => ({ ...prev, [property]: value }));
  }, []);

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Block</DialogTitle>
      <DialogContent>
        <BlockEditorFields block={block} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSave(block)} variant="contained">Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function EditorDashboard() {
  const [selected, setSelected] = useState({ framework: Object.keys(docs)[0] });
  const [localDocs, setLocalDocs] = useState(JSON.parse(JSON.stringify(docs)));
  const [dialog, setDialog] = useState({ open: false, type: '', idx: null, value: '', extra: {} });
  const [blockDialog, setBlockDialog] = useState({ open: false, stepIdx: null, blockIdx: null, initialBlock: null });
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);
  const stepRefs = useRef([]);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Move these declarations to the top, before any useEffect or logic that uses them
  let selectedModules = localDocs[selected.framework]?.modules || [];
  let selectedModule = selected.moduleIdx != null ? selectedModules[selected.moduleIdx] : null;
  let selectedSubmodules = selectedModule?.submodules || [];
  let selectedSubmodule = selected.submoduleIdx != null ? selectedSubmodules[selected.submoduleIdx] : null;
  let stepList = selectedSubmodule ? selectedSubmodule.steps : selectedModule?.steps;

  useEffect(() => {
    const saved = localStorage.getItem('integrationDocs-localDocs');
    if (saved) {
      setLocalDocs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    setSelectedStepIdx(0);
  }, [selectedModule, selectedSubmodule]);

  useEffect(() => {
    if (stepRefs.current[selectedStepIdx]) {
      stepRefs.current[selectedStepIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedStepIdx]);

  // --- Module CRUD (update selection after add) ---
  const handleAddModule = () => setDialog({ open: true, type: 'addModule', value: '', idx: null, extra: {} });
  const handleEditModule = (idx) => setDialog({ open: true, type: 'editModule', idx, value: selectedModules[idx].name, extra: {} });
  const handleDeleteModule = (idx) => {
    const modules = [...selectedModules];
    modules.splice(idx, 1);
    setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
    setSelected({ framework: selected.framework });
  };

  // --- Submodule CRUD (remove move buttons) ---
  const handleAddSubmodule = () => setDialog({ open: true, type: 'addSubmodule', value: '', idx: null, extra: {} });
  const handleEditSubmodule = (idx) => setDialog({ open: true, type: 'editSubmodule', idx, value: selectedSubmodules[idx].name, extra: {} });
  const handleDeleteSubmodule = (idx) => {
    const submodules = [...selectedSubmodules];
    submodules.splice(idx, 1);
    const modules = [...selectedModules];
    modules[selected.moduleIdx] = { ...modules[selected.moduleIdx], submodules };
    setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
    setSelected({ framework: selected.framework, moduleIdx: selected.moduleIdx });
  };

  // --- Step CRUD (remove move buttons) ---
  const handleAddStep = () => setDialog({ open: true, type: 'addStep', value: '', idx: null, extra: { blocks: [] } });
  const handleEditStep = (idx) => setDialog({ open: true, type: 'editStep', idx, value: stepList[idx].title, extra: { blocks: stepList[idx].blocks } });
  const handleDeleteStep = (idx) => {
    const steps = [...stepList];
    steps.splice(idx, 1);
    updateSteps(steps);
  };
  function updateSteps(steps) {
    if (selectedSubmodule) {
      const submodules = [...selectedSubmodules];
      submodules[selected.submoduleIdx] = { ...selectedSubmodule, steps };
      const modules = [...selectedModules];
      modules[selected.moduleIdx] = { ...selectedModule, submodules };
      setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
    } else if (selectedModule) {
      const modules = [...selectedModules];
      modules[selected.moduleIdx] = { ...selectedModule, steps };
      setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
    }
  }

  // --- Block CRUD (remove move buttons) ---
  const handleAddBlock = (stepIdx) => {
    setBlockDialog({ open: true, stepIdx, blockIdx: null, initialBlock: { type: 'text', content: '' } });
  };
  const handleEditBlock = (stepIdx, blockIdx) => {
    const block = stepList[stepIdx].blocks[blockIdx];
    setBlockDialog({ open: true, stepIdx, blockIdx, initialBlock: { ...block } });
  };
  const handleDeleteBlock = (stepIdx, blockIdx) => {
    const steps = [...stepList];
    steps[stepIdx].blocks.splice(blockIdx, 1);
    updateSteps(steps);
  };

  // --- Drag and Drop Handlers ---
  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, type } = result;
    if (type === 'module') {
      const modules = reorder(selectedModules, source.index, destination.index);
      setLocalDocs(prev => ({
        ...prev,
        [selected.framework]: {
          ...prev[selected.framework],
          modules
        }
      }));
      if (selected.moduleIdx === source.index) {
        setSelected(sel => ({ ...sel, moduleIdx: destination.index }));
      } else if (
        selected.moduleIdx > source.index && selected.moduleIdx <= destination.index
      ) {
        setSelected(sel => ({ ...sel, moduleIdx: sel.moduleIdx - 1 }));
      } else if (
        selected.moduleIdx < source.index && selected.moduleIdx >= destination.index
      ) {
        setSelected(sel => ({ ...sel, moduleIdx: sel.moduleIdx + 1 }));
      }
    } else if (type === 'submodule') {
      const submodules = reorder(selectedSubmodules, source.index, destination.index);
      setLocalDocs(prev => {
        const modules = [...prev[selected.framework].modules];
        modules[selected.moduleIdx] = {
          ...modules[selected.moduleIdx],
          submodules
        };
        return {
          ...prev,
          [selected.framework]: {
            ...prev[selected.framework],
            modules
          }
        };
      });
      if (selected.submoduleIdx === source.index) {
        setSelected(sel => ({ ...sel, submoduleIdx: destination.index }));
      } else if (
        selected.submoduleIdx > source.index && selected.submoduleIdx <= destination.index
      ) {
        setSelected(sel => ({ ...sel, submoduleIdx: sel.submoduleIdx - 1 }));
      } else if (
        selected.submoduleIdx < source.index && selected.submoduleIdx >= destination.index
      ) {
        setSelected(sel => ({ ...sel, submoduleIdx: sel.submoduleIdx + 1 }));
      }
    } else if (type === 'step') {
      const steps = reorder(stepList, source.index, destination.index);
      updateSteps(steps);
    } else if (type.startsWith('block-')) {
      const stepIdx = parseInt(type.split('-')[1], 10);
      const steps = [...stepList];
      steps[stepIdx].blocks = reorder(steps[stepIdx].blocks, source.index, destination.index);
      updateSteps(steps);
    }
  }

  // --- Download JSON ---
  const handleDownload = () => {
    const jsonValue = JSON.stringify(localDocs[selected.framework], null, 2);
    const blob = new Blob([jsonValue], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.framework}Docs.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Dialog Handlers ---
  const handleDialogCancel = () => {
    setDialog({ open: false, type: '', idx: null, value: '', extra: {} });
  };

  const handleDialogSave = () => {
    if (dialog.type === 'addModule') {
      const modules = [...selectedModules, { name: dialog.value, steps: [] }];
      setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
      setSelected({ framework: selected.framework, moduleIdx: modules.length - 1 });
    } else if (dialog.type === 'editModule') {
      const modules = [...selectedModules];
      modules[dialog.idx] = { ...modules[dialog.idx], name: dialog.value };
      setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
    } else if (dialog.type === 'addSubmodule') {
      const submodules = [...selectedSubmodules, { name: dialog.value, steps: [] }];
      const modules = [...selectedModules];
      modules[selected.moduleIdx] = { ...modules[selected.moduleIdx], submodules };
      setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
      setSelected({ framework: selected.framework, moduleIdx: selected.moduleIdx, submoduleIdx: submodules.length - 1 });
    } else if (dialog.type === 'editSubmodule') {
      const submodules = [...selectedSubmodules];
      submodules[dialog.idx] = { ...submodules[dialog.idx], name: dialog.value };
      const modules = [...selectedModules];
      modules[selected.moduleIdx] = { ...modules[selected.moduleIdx], submodules };
      setLocalDocs({ ...localDocs, [selected.framework]: { ...localDocs[selected.framework], modules } });
    } else if (dialog.type === 'addStep') {
      const steps = [...stepList, { id: generateId(), title: dialog.value, blocks: [] }];
      updateSteps(steps);
    } else if (dialog.type === 'editStep') {
      const steps = [...stepList];
      steps[dialog.idx] = { ...steps[dialog.idx], title: dialog.value, blocks: dialog.extra.blocks };
      updateSteps(steps);
    } else if (dialog.type === 'addBlock') {
      const steps = [...stepList];
      steps[dialog.stepIdx].blocks.push(dialog.initialBlock);
      updateSteps(steps);
    } else if (dialog.type === 'editBlock') {
      const steps = [...stepList];
      steps[dialog.stepIdx].blocks[dialog.blockIdx] = dialog.initialBlock;
      updateSteps(steps);
    }
    setDialog({ open: false, type: '', idx: null, value: '', extra: {} });
  };

  const handleBlockDialogCancel = () => {
    setBlockDialog({ open: false, stepIdx: null, blockIdx: null, initialBlock: null });
  };

  const handleBlockDialogSave = (block) => {
    const steps = [...stepList];
    if (blockDialog.blockIdx == null) {
      steps[blockDialog.stepIdx].blocks.push(block);
    } else {
      steps[blockDialog.stepIdx].blocks[blockDialog.blockIdx] = block;
    }
    updateSteps(steps);
    setBlockDialog({ open: false, stepIdx: null, blockIdx: null, initialBlock: null });
  };

  function handleSaveLocal() {
    localStorage.setItem('integrationDocs-localDocs', JSON.stringify(localDocs));
  }

  async function handleSubmitForReview(type, idx, subIdx) {
    let data;
    if (type === 'module') {
      data = selectedModules[idx];
    } else if (type === 'submodule') {
      data = selectedSubmodules[subIdx];
    }
    try {
      const res = await fetch('/api/submit-for-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error('Failed to submit for review');
      setSnackbar({ open: true, message: 'Submitted for review!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <FrameworkSidebar selected={selected} onSelect={setSelected} docs={localDocs} />
      <div style={{ flex: 1, padding: 32, overflowY: 'auto', position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <h2 style={{ margin: 0 }}>Documentation Editor (Local Only)</h2>
          <div>
            <Button variant="outlined" onClick={handleDownload} sx={{ mr: 2 }}>Download JSON</Button>
            <Button variant="contained" color="primary" onClick={handleSaveLocal}>Save</Button>
            {!showRightSidebar && (
              <Button variant="outlined" onClick={() => setShowRightSidebar(true)} sx={{ ml: 2 }}>
                Show Step Nav
              </Button>
            )}
          </div>
        </Box>
        <h3>Modules</h3>
        <Button variant="contained" onClick={handleAddModule} sx={{ mb: 2 }}>Add Module</Button>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="modules" type="module">
            {(provided) => (
              <List ref={provided.innerRef} {...provided.droppableProps}>
                {selectedModules.map((mod, idx) => (
                  <Draggable key={mod.name} draggableId={`module-${mod.name}`} index={idx}>
                    {(provided, snapshot) => (
                      <ListItem
                        selected={selected.moduleIdx === idx && selected.submoduleIdx == null}
                        sx={{ background: snapshot.isDragging ? '#e3f2fd' : undefined }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span {...provided.dragHandleProps}><DragIndicatorIcon fontSize="small" /></span>
                        <ListItemText primary={mod.name} />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => handleEditModule(idx)} sx={{ bgcolor: '#e3f2fd', borderRadius: '50%', mr: 1, '&:hover': { bgcolor: '#90caf9' } }}><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDeleteModule(idx)} sx={{ bgcolor: '#e3f2fd', borderRadius: '50%', '&:hover': { bgcolor: '#90caf9' } }}><DeleteIcon /></IconButton>
                          <Button size="small" onClick={() => { setSelected({ framework: selected.framework, moduleIdx: idx }); handleAddSubmodule(); }} sx={{ ml: 1 }}>Add Submodule</Button>
                          <Button size="small" variant="contained" color="secondary" onClick={() => handleSubmitForReview('module', idx)} sx={{ ml: 1, border: '2px solid #321B2D', fontWeight: 700 }}>
                            Submit for Review
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
          {selectedModule && (
            <>
              <h4>Submodules of {selectedModule.name}</h4>
              {selectedSubmodules && selectedSubmodules.length > 0 && (
                <Droppable droppableId="submodules" type="submodule">
                  {(provided) => (
                    <List ref={provided.innerRef} {...provided.droppableProps}>
                      {selectedSubmodules.map((sub, sIdx) => (
                        <Draggable key={sub.name} draggableId={`submodule-${sub.name}`} index={sIdx}>
                          {(provided, snapshot) => (
                            <ListItem
                              selected={selected.submoduleIdx === sIdx}
                              sx={{ background: snapshot.isDragging ? '#e3f2fd' : undefined }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <span {...provided.dragHandleProps}><DragIndicatorIcon fontSize="small" /></span>
                              <ListItemText primary={sub.name} />
                              <ListItemSecondaryAction>
                                <IconButton onClick={() => handleEditSubmodule(sIdx)} sx={{ bgcolor: '#e8f5e9', borderRadius: '50%', mr: 1, '&:hover': { bgcolor: '#a5d6a7' } }}><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDeleteSubmodule(sIdx)} sx={{ bgcolor: '#e8f5e9', borderRadius: '50%', '&:hover': { bgcolor: '#a5d6a7' } }}><DeleteIcon /></IconButton>
                                <Button size="small" variant="contained" color="secondary" onClick={() => handleSubmitForReview('submodule', selected.moduleIdx, sIdx)} sx={{ ml: 1, border: '2px solid #321B2D', fontWeight: 700 }}>
                                  Submit for Review
                                </Button>
                              </ListItemSecondaryAction>
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              )}
            </>
          )}
          {/* Steps CRUD */}
          {(selectedModule || selectedSubmodule) && (
            <>
              <h4>Steps</h4>
              <Button variant="contained" onClick={handleAddStep} sx={{ mb: 2 }}>Add Step</Button>
              <Droppable droppableId="steps" type="step">
                {(provided) => (
                  <List ref={provided.innerRef} {...provided.droppableProps}>
                    {stepList && stepList.map((step, stepIdx) => (
                      <Draggable key={step.id || stepIdx} draggableId={step.id ? `step-${step.id}` : `step-${stepIdx}`} index={stepIdx}>
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            selected={dialog.type === 'editStep' && dialog.idx === stepIdx}
                            alignItems="flex-start"
                            sx={{ background: snapshot.isDragging ? '#e3f2fd' : undefined, flexDirection: 'column', alignItems: 'flex-start' }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span {...provided.dragHandleProps} style={{ cursor: 'grab', marginRight: 8 }}><DragIndicatorIcon fontSize="small" /></span>
                              <ListItemText primary={step.title} />
                              <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                                <IconButton onClick={() => handleEditStep(stepIdx)} sx={{ bgcolor: '#fff3e0', borderRadius: '50%', mr: 1, '&:hover': { bgcolor: '#ffb74d' } }}><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDeleteStep(stepIdx)} sx={{ bgcolor: '#fff3e0', borderRadius: '50%', '&:hover': { bgcolor: '#ffb74d' } }}><DeleteIcon /></IconButton>
                              </Stack>
                            </Box>
                            <Box sx={{ width: '100%' }}>
                              <Button
                                size="small"
                                onClick={() => handleAddBlock(stepIdx)}
                                sx={{
                                  mt: 1,
                                  mb: 1,
                                  backgroundColor: '#FFF0EB',
                                  color: '#321B2D',
                                  fontWeight: 600,
                                  '&:hover': {
                                    backgroundColor: '#f5d6cc',
                                  },
                                }}
                              >
                                Add Block
                              </Button>
                              <Droppable droppableId={`block-${stepIdx}`} type={`block-${stepIdx}`} direction="vertical">
                                {(provided) => (
                                  <List dense ref={provided.innerRef} {...provided.droppableProps}>
                                    {step.blocks.map((block, blockIdx) => (
                                      <Draggable key={blockIdx} draggableId={`block-${stepIdx}-${blockIdx}`} index={blockIdx}>
                                        {(provided, snapshot) => (
                                          <ListItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{ pl: 2, background: snapshot.isDragging ? '#e3f2fd' : undefined }}
                                          >
                                            <span {...provided.dragHandleProps}><DragIndicatorIcon fontSize="small" /></span>
                                            <ListItemText
                                              primary={block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                                              secondary={block.content || block.url || ''}
                                            />
                                            <ListItemSecondaryAction>
                                              <IconButton onClick={() => handleEditBlock(stepIdx, blockIdx)} sx={{ bgcolor: '#f3e5f5', borderRadius: '50%', mr: 1, '&:hover': { bgcolor: '#ce93d8' } }}><EditIcon /></IconButton>
                                              <IconButton onClick={() => handleDeleteBlock(stepIdx, blockIdx)} sx={{ bgcolor: '#f3e5f5', borderRadius: '50%', '&:hover': { bgcolor: '#ce93d8' } }}><DeleteIcon /></IconButton>
                                            </ListItemSecondaryAction>
                                          </ListItem>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </List>
                                )}
                              </Droppable>
                            </Box>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </>
          )}
        </DragDropContext>
        {/* Dialog for all CRUD */}
        <Dialog open={dialog.open} onClose={handleDialogCancel} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialog.type.startsWith('add') ? 'Add' : 'Edit'}{' '}
            {dialog.type.includes('Module') ? 'Module' : dialog.type.includes('Submodule') ? 'Submodule' : dialog.type.includes('Step') ? 'Step' : 'Block'}
          </DialogTitle>
          <DialogContent>
            {(dialog.type === 'addModule' || dialog.type === 'editModule' || dialog.type === 'addSubmodule' || dialog.type === 'editSubmodule' || dialog.type === 'addStep' || dialog.type === 'editStep') && (
              <TextField
                autoFocus
                margin="dense"
                label="Name/Title"
                fullWidth
                value={dialog.value}
                onChange={e => setDialog({ ...dialog, value: e.target.value })}
              />
            )}
            {(dialog.type === 'addBlock' || dialog.type === 'editBlock') && (
              <BlockEditorFields 
                block={dialog.extra} 
                onChange={setDialog} 
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogSave} variant="contained">Save</Button>
            <Button onClick={handleDialogCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {blockDialog.open && (
          <BlockDialog
            open={blockDialog.open}
            initialBlock={blockDialog.initialBlock}
            onSave={handleBlockDialogSave}
            onCancel={handleBlockDialogCancel}
          />
        )}
        {showRightSidebar && (
          <StepNavSidebar
            selectedModule={selectedModule}
            selectedSubmodules={selectedSubmodules}
            selectedSubmoduleIdx={selected.submoduleIdx}
            stepList={stepList}
            selectedStepIdx={selectedStepIdx}
            onSubmoduleSelect={idx => {
              setSelected(sel => ({ ...sel, submoduleIdx: idx }));
              setSelectedStepIdx(0);
            }}
            onStepSelect={setSelectedStepIdx}
            topOffset={64}
            onClose={() => setShowRightSidebar(false)}
            onToggleLeftSidebar={() => {/* implement if needed */}}
          />
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </div>
    </div>
  );
}

export default EditorDashboard;