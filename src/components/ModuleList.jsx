import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import StepList from './StepList';

function ModuleList({ modules }) {
  return (
    <div>
      {modules.map((mod, idx) => (
        <Accordion key={idx}>
          <AccordionSummary>
            <Typography>{mod.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <StepList steps={mod.steps} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
export default ModuleList; 