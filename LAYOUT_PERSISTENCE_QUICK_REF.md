# Layout Persistence Quick Reference

## 🚀 Quick Start

```tsx
import { DataGrid } from './components/DataGrid';

<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={{
    enabled: true,
    storageKey: 'my-grid',
    autoSave: true,
    autoLoad: true,
  }}
/>
```

## 📦 What Gets Saved

- ✅ Column order
- ✅ Column widths
- ✅ Pinned columns (left/right)
- ✅ Hidden columns
- ✅ Filters (all types)
- ✅ Sorting
- ✅ Page size
- ✅ Grouping

## 🎯 Storage Strategies

### LocalStorage (Default)
```tsx
persistenceConfig={{
  enabled: true,
  storageKey: 'my-grid',
  strategy: 'localStorage',
}}
```

### Server (REST API)
```tsx
persistenceConfig={{
  enabled: true,
  storageKey: 'my-grid',
  strategy: 'server',
  serverConfig: {
    baseUrl: 'https://api.example.com',
    headers: { 'Authorization': 'Bearer TOKEN' },
  },
}}
```

### User Profile
```tsx
persistenceConfig={{
  enabled: true,
  storageKey: 'my-grid',
  strategy: 'userProfile',
  userProfileConfig: {
    userId: 'user-123',
  },
}}
```

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | - | Enable/disable persistence |
| `storageKey` | string | - | Unique identifier |
| `strategy` | string | 'localStorage' | Storage type |
| `autoSave` | boolean | false | Auto-save on changes |
| `autoSaveDelay` | number | 1000 | Debounce delay (ms) |
| `autoLoad` | boolean | false | Auto-load on mount |
| `serverConfig` | object | - | Server API config |
| `userProfileConfig` | object | - | User profile config |
| `customAdapter` | object | - | Custom storage |

## 💻 Programmatic API

```tsx
import { LayoutPersistenceManager, createPreset } from './components/DataGrid';

// Initialize
const manager = new LayoutPersistenceManager(config);

// Save preset
const preset = createPreset('My Layout', layout);
await manager.savePreset(preset);

// Load preset
const loaded = await manager.loadPreset('preset-id');

// List all presets
const presets = await manager.listPresets();

// Delete preset
await manager.deletePreset('preset-id');

// Auto-save
await manager.autoSave(layout);

// Load last saved
const last = await manager.loadLastPreset();
```

## 🎨 UI Usage

1. Click **"Layout Presets"** button in toolbar
2. Modify grid (resize, reorder, filter, etc.)
3. Click **"Save Current"**
4. Enter name and description
5. Click **"Save Preset"**

To load: Click preset from dropdown

## 📡 Server API Requirements

```
POST   /api/layouts              # Save preset
GET    /api/layouts/:key         # List presets
GET    /api/layouts/:key/:id     # Load preset
DELETE /api/layouts/:key/:id     # Delete preset
```

## 🔨 Custom Storage Adapter

```typescript
import { StorageAdapter, LayoutPreset } from './components/DataGrid';

class CustomAdapter implements StorageAdapter {
  async save(key: string, preset: LayoutPreset): Promise<void> {
    // Your save logic
  }
  
  async load(key: string, presetId?: string): Promise<LayoutPreset | LayoutPreset[] | null> {
    // Your load logic
  }
  
  async delete(key: string, presetId: string): Promise<void> {
    // Your delete logic
  }
  
  async list(key: string): Promise<LayoutPreset[]> {
    // Your list logic
  }
}

// Use it
persistenceConfig={{
  enabled: true,
  storageKey: 'my-grid',
  customAdapter: new CustomAdapter(),
}}
```

## 🎯 Common Patterns

### With Auto-Save
```tsx
<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={{
    enabled: true,
    storageKey: 'auto-save-grid',
    autoSave: true,
    autoSaveDelay: 1000,
    autoLoad: true,
  }}
/>
```

### With Layout Change Callback
```tsx
<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={config}
  onLayoutChange={(layout) => {
    console.log('Layout changed:', layout);
  }}
/>
```

### Per-User Layouts
```tsx
<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={{
    enabled: true,
    storageKey: 'team-grid',
    strategy: 'userProfile',
    userProfileConfig: {
      userId: currentUser.id,
    },
    autoSave: true,
    autoLoad: true,
  }}
/>
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Not saving | Check `enabled: true` and `storageKey` set |
| Not loading | Verify `autoLoad: true` and key matches |
| Auto-save not working | Check `autoSave: true` and console errors |
| Server errors | Verify `baseUrl`, endpoints, and auth headers |
| Storage full | Clear old presets or use server strategy |

## 📊 Performance Tips

- Use `autoSaveDelay: 1000` (1 second) for optimal UX
- Consider server strategy for large teams
- Monitor localStorage quota (5-10MB typical)
- Use custom adapter for database storage
- Implement caching for server strategy

## 🔐 Security Tips

- Use HTTPS for server strategy
- Implement proper authentication
- Validate layout data on server
- Sanitize user input (names, descriptions)
- Don't store sensitive data in layouts
- Rate limit API endpoints

## 📚 Type Definitions

```typescript
interface PersistenceConfig {
  enabled: boolean;
  storageKey: string;
  strategy?: 'localStorage' | 'server' | 'userProfile';
  autoSave?: boolean;
  autoSaveDelay?: number;
  autoLoad?: boolean;
  serverConfig?: ServerConfig;
  userProfileConfig?: UserProfileConfig;
  customAdapter?: StorageAdapter;
}

interface LayoutPreset {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  layout: {
    columnOrder: string[];
    columnWidths: { [field: string]: number };
    pinnedColumnsLeft: string[];
    pinnedColumnsRight: string[];
    hiddenColumns: string[];
    sortConfig: SortConfig;
    filterConfig: FilterConfig;
    pageSize: number;
    groupBy?: string[];
  };
}
```

## 🎁 Examples

### Basic
```tsx
<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={{ enabled: true, storageKey: 'basic-grid' }}
/>
```

### Full Featured
```tsx
<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={{
    enabled: true,
    storageKey: 'advanced-grid',
    strategy: 'localStorage',
    autoSave: true,
    autoSaveDelay: 1000,
    autoLoad: true,
  }}
  onLayoutChange={(layout) => analytics.track('layout_changed', layout)}
/>
```

### Server-Backed
```tsx
<DataGrid
  columns={columns}
  rows={rows}
  persistenceConfig={{
    enabled: true,
    storageKey: 'server-grid',
    strategy: 'server',
    autoSave: true,
    serverConfig: {
      baseUrl: 'https://api.myapp.com',
      headers: { 'Authorization': `Bearer ${token}` },
    },
  }}
/>
```

---

**For full documentation, see [LAYOUT_PERSISTENCE_FEATURE.md](./LAYOUT_PERSISTENCE_FEATURE.md)**
