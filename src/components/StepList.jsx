import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import StepBlock from './StepBlock';

function StepList({ steps }) {
  if (!steps || steps.length === 0) {
    return <Typography>No steps available for this module yet.</Typography>;
  }
  return (
    <div>
      {steps.map((step, idx) => (
        <Card key={idx} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{`Step ${idx + 1}: ${step.title}`}</Typography>
            {step.blocks && step.blocks.map((block, bIdx) => (
              <StepBlock key={bIdx} block={block} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default StepList; 