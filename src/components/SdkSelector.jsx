import React from 'react';
import { Tabs, Tab } from '@mui/material';

const sdks = [
  { label: 'Android', value: 'android' },
  { label: 'iOS', value: 'ios' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'React Native', value: 'reactnative' }
];

function SdkSelector({ selected, onChange }) {
  return (
    <Tabs
      value={selected}
      onChange={(_, val) => onChange(val)}
      indicatorColor="primary"
      textColor="primary"
      sx={{ mb: 2 }}
    >
      {sdks.map(sdk => (
        <Tab key={sdk.value} label={sdk.label} value={sdk.value} />
      ))}
    </Tabs>
  );
}

export default SdkSelector;