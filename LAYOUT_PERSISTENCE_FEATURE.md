# Layout Persistence Feature

## Overview

The Layout Persistence feature allows users to save and restore their DataGrid configurations, including column order, widths, pinning, filters, sorting, page size, and grouping. This feature is essential for enterprise applications where users customize their views and want to preserve those customizations across sessions.

## Features

### What Gets Saved

The following grid state is persisted:

- ✅ **Column Order** - The arrangement of columns
- ✅ **Column Widths** - Custom column width settings
- ✅ **Pinned Columns** - Left and right pinned columns
- ✅ **Hidden Columns** - Which columns are visible/hidden
- ✅ **Filters** - All active column filters with their values
- ✅ **Sorting** - Sort field and direction
- ✅ **Page Size** - Number of rows per page
- ✅ **Grouping** - Group-by configurations

### Storage Strategies

Three built-in storage strategies are provided:

1. **localStorage** - Browser-based storage (default)
2. **server** - REST API-based storage
3. **userProfile** - User-specific storage with custom adapters

You can also implement custom storage adapters for other persistence mechanisms.

## Basic Usage

### Enable Persistence with LocalStorage

```tsx
import { DataGrid, PersistenceConfig } from 'react-open-source-grid';

const persistenceConfig: PersistenceConfig = {
  enabled: true,
  storageKey: 'my-grid-layout',
  strategy: 'localStorage',
  autoSave: true,
  autoSaveDelay: 1000,
  autoLoad: true,
};

<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={persistenceConfig}
/>
```

### Manual Save/Load

Users can manually save and load presets using the **Layout Presets** button in the grid toolbar:

1. Click **"Layout Presets"** button
2. Modify grid settings (resize, reorder, filter, etc.)
3. Click **"Save Current"**
4. Enter a name and description
5. Click **"Save Preset"**

To load a preset:
1. Click **"Layout Presets"**
2. Select a preset from the list

## Configuration Options

### PersistenceConfig Interface

```typescript
interface PersistenceConfig {
  enabled: boolean;              // Enable/disable persistence
  storageKey: string;           // Unique identifier for this grid
  strategy?: StorageStrategy;   // 'localStorage' | 'server' | 'userProfile'
  autoSave?: boolean;           // Auto-save on layout changes
  autoSaveDelay?: number;       // Debounce delay in ms (default: 1000)
  autoLoad?: boolean;           // Auto-load last saved preset on mount
  serverConfig?: ServerConfig;  // Required for server strategy
  userProfileConfig?: UserProfileConfig; // Required for userProfile strategy
  customAdapter?: StorageAdapter; // Custom storage implementation
}
```

## Storage Strategies

### 1. LocalStorage Strategy

Stores layouts in browser's localStorage. Best for single-user applications.

```tsx
const persistenceConfig: PersistenceConfig = {
  enabled: true,
  storageKey: 'employee-grid',
  strategy: 'localStorage',
  autoSave: true,
  autoLoad: true,
};
```

**Pros:**
- Simple, no backend required
- Fast access
- Works offline

**Cons:**
- Not shared across devices
- Limited to ~5-10MB storage
- Cleared when browser data is cleared

### 2. Server Strategy

Stores layouts on a remote server via REST API. Best for multi-device access.

```tsx
const persistenceConfig: PersistenceConfig = {
  enabled: true,
  storageKey: 'sales-dashboard',
  strategy: 'server',
  autoSave: true,
  autoLoad: true,
  serverConfig: {
    baseUrl: 'https://api.example.com',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json',
    },
    // Optional custom endpoints
    saveEndpoint: '/api/layouts',
    loadEndpoint: '/api/layouts',
    deleteEndpoint: '/api/layouts',
    listEndpoint: '/api/layouts',
  },
};
```

**Required API Endpoints:**

```
POST /api/layouts
Body: { key: string, preset: LayoutPreset }
Response: 200 OK

GET /api/layouts/:key
Response: LayoutPreset[]

GET /api/layouts/:key/:presetId
Response: LayoutPreset | 404

DELETE /api/layouts/:key/:presetId
Response: 200 OK
```

**Pros:**
- Syncs across devices
- Centralized management
- Can implement access control

**Cons:**
- Requires backend infrastructure
- Network latency
- Needs authentication

### 3. User Profile Strategy

Stores layouts per user, using localStorage by default but can use custom adapters.

```tsx
const persistenceConfig: PersistenceConfig = {
  enabled: true,
  storageKey: 'reports-grid',
  strategy: 'userProfile',
  userProfileConfig: {
    userId: 'user-123',
    profileKey: 'grid-layouts',
  },
};
```

**Pros:**
- User-specific layouts
- Flexible adapter system
- Can combine with localStorage or server

**Cons:**
- Requires user identification
- More complex setup

## Custom Storage Adapter

Implement your own storage mechanism by creating a custom adapter:

```typescript
import { StorageAdapter, LayoutPreset } from 'react-open-source-grid';

class DatabaseAdapter implements StorageAdapter {
  async save(key: string, preset: LayoutPreset): Promise<void> {
    // Save to your database
    await fetch('/api/db/layouts', {
      method: 'POST',
      body: JSON.stringify({ key, preset }),
    });
  }

  async load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null> {
    // Load from your database
    const response = await fetch(`/api/db/layouts/${key}${presetId ? `/${presetId}` : ''}`);
    return response.json();
  }

  async delete(key: string, presetId: string): Promise<void> {
    await fetch(`/api/db/layouts/${key}/${presetId}`, { method: 'DELETE' });
  }

  async list(key: string): Promise<LayoutPreset[]> {
    const response = await fetch(`/api/db/layouts/${key}`);
    return response.json();
  }
}

// Use custom adapter
const persistenceConfig: PersistenceConfig = {
  enabled: true,
  storageKey: 'my-grid',
  customAdapter: new DatabaseAdapter(),
};
```

## Auto-Save and Auto-Load

### Auto-Save

When enabled, the grid automatically saves the layout after changes with a debounce delay:

```tsx
const persistenceConfig: PersistenceConfig = {
  enabled: true,
  storageKey: 'my-grid',
  autoSave: true,
  autoSaveDelay: 1000, // Wait 1 second after last change
};
```

Changes that trigger auto-save:
- Column reordering
- Column resizing
- Pinning/unpinning columns
- Hiding/showing columns
- Applying filters
- Changing sort
- Changing page size
- Adding/removing grouping

### Auto-Load

When enabled, the last saved layout is automatically restored on mount:

```tsx
const persistenceConfig: PersistenceConfig = {
  enabled: true,
  storageKey: 'my-grid',
  autoLoad: true,
};
```

## Layout Change Callback

Get notified when the layout changes:

```tsx
import { LayoutPreset } from 'react-open-source-grid';

const handleLayoutChange = (layout: LayoutPreset['layout']) => {
  console.log('Layout changed:', layout);
  // Send analytics, log changes, etc.
};

<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={persistenceConfig}
  onLayoutChange={handleLayoutChange}
/>
```

## Programmatic Access

### Using LayoutPersistenceManager

```typescript
import { 
  LayoutPersistenceManager, 
  createPreset 
} from 'react-open-source-grid';

// Initialize manager
const manager = new LayoutPersistenceManager({
  enabled: true,
  storageKey: 'my-grid',
  strategy: 'localStorage',
});

// Save a preset
const layout = {
  columnOrder: ['id', 'name', 'email'],
  columnWidths: { id: 80, name: 200, email: 250 },
  // ... other layout properties
};

const preset = createPreset('My Layout', layout, 'Custom description');
await manager.savePreset(preset);

// Load a preset
const loadedPreset = await manager.loadPreset('preset-id');

// List all presets
const presets = await manager.listPresets();

// Delete a preset
await manager.deletePreset('preset-id');

// Auto-save
await manager.autoSave(layout);

// Load auto-saved
const autoSaved = await manager.loadAutoSave();
```

## UI Components

### LayoutPresetsManager Component

The built-in UI for managing presets:

```tsx
import { LayoutPresetsManager } from 'react-open-source-grid';

<LayoutPresetsManager
  manager={persistenceManager}
  currentLayout={getCurrentLayout()}
  onLoadPreset={(layout) => applyLayout(layout)}
  onResetLayout={() => resetToDefault()}
/>
```

**Features:**
- Dropdown menu with preset list
- Save current layout with name/description
- Load saved presets with one click
- Update existing presets
- Delete presets
- Reset to default layout
- Visual timestamps for each preset

## Best Practices

### 1. Choose the Right Storage Strategy

- **LocalStorage**: Simple apps, single-user, no backend
- **Server**: Multi-device, team collaboration, audit trails
- **UserProfile**: Per-user customization with flexible storage

### 2. Use Meaningful Storage Keys

```tsx
// Good - descriptive and namespaced
storageKey: 'app-name:sales-dashboard:employee-grid'

// Bad - generic
storageKey: 'grid1'
```

### 3. Enable Auto-Save with Appropriate Delay

```tsx
autoSave: true,
autoSaveDelay: 1000, // 1 second - good balance
```

- Too short (< 500ms): May cause performance issues
- Too long (> 3000ms): Users may lose changes

### 4. Handle Errors Gracefully

```tsx
const handleLayoutChange = (layout) => {
  try {
    // Your logic
  } catch (error) {
    console.error('Failed to handle layout change:', error);
    // Show user-friendly message
  }
};
```

### 5. Version Your Layout Format

If your grid structure changes over time, consider versioning:

```typescript
const preset = createPreset('My Layout', {
  version: '1.0.0',
  ...layout,
});
```

### 6. Provide Reset Option

Always give users a way to reset to defaults:

```tsx
<button onClick={() => dispatch({ type: 'RESET_COLUMN_LAYOUT' })}>
  Reset Layout
</button>
```

## Examples

### Complete Example with All Features

```tsx
import React, { useState } from 'react';
import { DataGrid, PersistenceConfig } from 'react-open-source-grid';

export const MyGrid = () => {
  const [layoutVersion, setLayoutVersion] = useState(0);

  const persistenceConfig: PersistenceConfig = {
    enabled: true,
    storageKey: 'my-app:main-grid',
    strategy: 'localStorage',
    autoSave: true,
    autoSaveDelay: 1000,
    autoLoad: true,
  };

  const handleLayoutChange = (layout) => {
    console.log('Layout changed:', layout);
    setLayoutVersion(v => v + 1);
  };

  return (
    <div>
      <p>Layout Version: {layoutVersion}</p>
      <DataGrid
        columns={columns}
        rows={rows}
        pageSize={20}
        persistenceConfig={persistenceConfig}
        onLayoutChange={handleLayoutChange}
        footerConfig={{
          show: true,
          aggregates: [
            { field: 'amount', function: 'sum' },
          ],
        }}
      />
    </div>
  );
};
```

### Server-Side Implementation (Node.js/Express)

```javascript
// Example backend for server strategy
const express = require('express');
const app = express();
app.use(express.json());

// In-memory storage (use database in production)
const layouts = new Map();

// Save layout
app.post('/api/layouts', (req, res) => {
  const { key, preset } = req.body;
  
  if (!layouts.has(key)) {
    layouts.set(key, []);
  }
  
  const presets = layouts.get(key);
  const index = presets.findIndex(p => p.id === preset.id);
  
  if (index !== -1) {
    presets[index] = preset;
  } else {
    presets.push(preset);
  }
  
  res.json({ success: true });
});

// List layouts
app.get('/api/layouts/:key', (req, res) => {
  const presets = layouts.get(req.params.key) || [];
  res.json(presets);
});

// Load specific layout
app.get('/api/layouts/:key/:presetId', (req, res) => {
  const presets = layouts.get(req.params.key) || [];
  const preset = presets.find(p => p.id === req.params.presetId);
  
  if (preset) {
    res.json(preset);
  } else {
    res.status(404).json({ error: 'Preset not found' });
  }
});

// Delete layout
app.delete('/api/layouts/:key/:presetId', (req, res) => {
  const presets = layouts.get(req.params.key) || [];
  const filtered = presets.filter(p => p.id !== req.params.presetId);
  layouts.set(req.params.key, filtered);
  res.json({ success: true });
});

app.listen(3000);
```

## Troubleshooting

### Layouts Not Saving

1. Check if persistence is enabled: `persistenceConfig.enabled === true`
2. Verify storage key is set: `persistenceConfig.storageKey`
3. Check browser console for errors
4. For localStorage: Ensure storage quota isn't exceeded
5. For server: Verify API endpoints are correct and accessible

### Layouts Not Loading

1. Check `autoLoad` is enabled
2. Verify storage key matches saved layouts
3. Check if presets exist: Use browser DevTools → Application → LocalStorage
4. Ensure layout structure matches current grid configuration

### Auto-Save Not Working

1. Verify `autoSave: true`
2. Check `autoSaveDelay` value (default: 1000ms)
3. Ensure layout changes are actually occurring
4. Check console for persistence errors

### Server Strategy Failing

1. Verify `serverConfig.baseUrl` is correct
2. Check authentication headers
3. Test API endpoints independently
4. Review CORS settings
5. Check network tab in DevTools for failed requests

## API Reference

### Types

See the complete type definitions in `types.ts`:

- `LayoutPreset` - Complete preset structure
- `PersistenceConfig` - Configuration options
- `StorageAdapter` - Custom adapter interface
- `ServerConfig` - Server strategy config
- `UserProfileConfig` - User profile config

### Functions

- `createPreset()` - Create a new preset object
- `generatePresetId()` - Generate unique preset ID
- `getStorageAdapter()` - Get adapter based on config
- `debounce()` - Debounce helper for auto-save

### Components

- `DataGrid` - Main grid with persistence support
- `LayoutPresetsManager` - UI for managing presets

### Classes

- `LayoutPersistenceManager` - Main persistence API
- `LocalStorageAdapter` - localStorage implementation
- `ServerAdapter` - Server API implementation
- `UserProfileAdapter` - User-specific implementation

## Performance Considerations

### Storage Size

- LocalStorage is typically limited to 5-10MB per domain
- Each preset is typically < 5KB
- Monitor storage usage in production

### Auto-Save Frequency

- Default 1000ms delay is recommended
- Shorter delays may impact performance
- Consider disabling for very large grids (>1000 columns)

### Network Requests (Server Strategy)

- Auto-save triggers debounced API calls
- Consider implementing request batching
- Use optimistic updates for better UX

## Security Considerations

### LocalStorage

- Data is accessible to JavaScript on the same domain
- Don't store sensitive data
- Consider encryption for sensitive layouts

### Server Strategy

- Always use HTTPS in production
- Implement proper authentication/authorization
- Validate layout data on server
- Sanitize user input (preset names/descriptions)
- Rate limit API endpoints

## Migration Guide

### From No Persistence

```tsx
// Before
<DataGrid columns={columns} rows={rows} />

// After
<DataGrid 
  columns={columns} 
  rows={rows}
  persistenceConfig={{
    enabled: true,
    storageKey: 'my-grid',
  }}
/>
```

### From Custom Solution

If you have existing saved layouts:

```tsx
// Load existing layouts and convert to new format
const convertOldLayout = (oldLayout) => {
  return {
    id: generatePresetId(),
    name: 'Migrated Layout',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    layout: {
      columnOrder: oldLayout.columns,
      columnWidths: oldLayout.widths,
      // ... map other properties
    },
  };
};

// Save converted layouts
const manager = new LayoutPersistenceManager(config);
const converted = convertOldLayout(existingLayout);
await manager.savePreset(converted);
```

## Future Enhancements

Potential future features:

- [ ] Export/Import layouts as JSON
- [ ] Share layouts between users
- [ ] Layout templates/recommendations
- [ ] Cloud sync integration
- [ ] Layout comparison/diff
- [ ] Undo/redo for layout changes
- [ ] Layout permissions and access control
- [ ] Analytics on layout usage

## Support

For issues, questions, or feature requests, please refer to the main DataGrid documentation or create an issue in the project repository.

---

**Enterprise users love layout persistence!** 🎉
