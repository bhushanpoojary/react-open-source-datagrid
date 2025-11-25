import React from 'react';
import { GridApiDemo } from './DataGrid/GridApiDemo';

export const GridApiDemoPage: React.FC = () => {
  return (
    <div style={{ 
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#f8fafc'
    }}>
      <GridApiDemo />
    </div>
  );
};
