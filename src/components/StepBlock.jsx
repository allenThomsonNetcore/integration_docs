import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Alert, Chip } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

function StepBlock({ block }) {
  if (block.type === 'code' && block.languages) {
    const [selected, setSelected] = useState(0);
    const handleChange = (_, newValue) => setSelected(newValue);
    const langBlock = block.languages[selected];

    return (
      <Box my={2}>
        {block.languages.length > 1 ? (
          <Tabs value={selected} onChange={handleChange} sx={{ mb: 1 }}>
            {block.languages.map((l, idx) => (
              <Tab key={l.lang} label={l.label || l.lang} />
            ))}
          </Tabs>
        ) : (
          <Chip
            label={block.languages[0].label || block.languages[0].lang}
            size="small"
            sx={{ mb: 1, bgcolor: '#fff', color: '#321B2D', fontWeight: 600 }}
          />
        )}
        <SyntaxHighlighter language={langBlock.lang}>
          {langBlock.content}
        </SyntaxHighlighter>
      </Box>
    );
  }

  switch (block.type) {
    case 'text':
      return <div dangerouslySetInnerHTML={{ __html: block.content }} />;
    case 'code':
      return (
        <Box my={2}>
          {block.language && (
            <Chip
              label={block.language}
              size="small"
              sx={{ mb: 1, bgcolor: '#fff', color: '#321B2D', fontWeight: 600 }}
            />
          )}
          <SyntaxHighlighter language={block.language}>
            {block.content}
          </SyntaxHighlighter>
        </Box>
      );
    case 'prodcode':
      return (
        <Box my={2} bgcolor="#f5f5f5" p={2} borderRadius={2}>
          <Typography variant="subtitle2" color="primary">Production Code</Typography>
          <SyntaxHighlighter language={block.language}>
            {block.content}
          </SyntaxHighlighter>
        </Box>
      );
    case 'image':
      return <img src={block.url} alt={block.alt || ''} style={{ maxWidth: '100%', margin: '16px 0' }} />;
    case 'video':
      return (
        <video controls style={{ maxWidth: '100%', margin: '16px 0' }}>
          <source src={block.url} />
          Your browser does not support the video tag.
        </video>
      );
    case 'gif':
      return <img src={block.url} alt={block.alt || 'GIF'} style={{ maxWidth: '100%', margin: '16px 0' }} />;
    case 'note':
      return (
        <Alert severity="info" sx={{ my: 1 }}>
          {block.content}
        </Alert>
      );
    default:
      return null;
  }
}

export default StepBlock; 