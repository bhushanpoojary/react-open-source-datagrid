# Cell Renderer Framework - Quick Reference

## Quick Start

```typescript
import { DataGrid, StatusChip, ProgressBar, ButtonCell } from 'react-open-source-grid';

const columns: Column[] = [
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (row) => <StatusChip status={row.status} />
  }
];

<DataGrid columns={columns} rows={data} />
```

## Available Components

| Component | Usage | Props |
|-----------|-------|-------|
| **StatusChip** | Status badges | `status: string` |
| **ProgressBar** | Progress indicators | `value: number`, `color?`, `showLabel?` |
| **IconCell** | Icon + text | `icon: string`, `text?`, `iconColor?` |
| **ImageCell** | Avatar/image | `src: string`, `alt: string`, `text?`, `size?` |
| **ButtonCell** | Action buttons | `label: string`, `onClick`, `variant?`, `disabled?` |
| **BadgeCell** | Generic badges | `text: string`, `color?`, `backgroundColor?` |
| **PriorityIndicator** | Priority levels | `priority: 'low' \| 'medium' \| 'high' \| 'critical'` |
| **Rating** | Star ratings | `rating: number`, `maxRating?` |
| **CurrencyCell** | Currency display | `amount: number`, `currency?`, `locale?` |

## Common Patterns

### Status Badge
```typescript
{
  field: 'status',
  headerName: 'Status',
  renderCell: (row) => <StatusChip status={row.status} />
}
```

### Progress Bar
```typescript
{
  field: 'progress',
  headerName: 'Progress',
  renderCell: (row) => <ProgressBar value={row.progress} />
}
```

### User Avatar
```typescript
{
  field: 'user',
  headerName: 'User',
  renderCell: (row) => (
    <ImageCell 
      src={row.avatar}
      alt={row.name}
      text={row.name}
    />
  )
}
```

### Action Buttons
```typescript
{
  field: 'actions',
  headerName: 'Actions',
  renderCell: (row) => (
    <div style={{ display: 'flex', gap: '6px' }}>
      <ButtonCell 
        label="Edit" 
        onClick={() => handleEdit(row)}
        variant="primary"
      />
      <ButtonCell 
        label="Delete" 
        onClick={() => handleDelete(row)}
        variant="danger"
      />
    </div>
  )
}
```

### Currency
```typescript
{
  field: 'amount',
  headerName: 'Amount',
  renderCell: (row) => <CurrencyCell amount={row.amount} />
}
```

### Custom Badge
```typescript
{
  field: 'category',
  headerName: 'Category',
  renderCell: (row) => (
    <BadgeCell 
      text={row.category}
      backgroundColor="#e0e7ff"
      color="#3730a3"
    />
  )
}
```

## Tips

1. **Stop Event Propagation**: Prevent row selection when clicking buttons
   ```typescript
   onClick={(e) => {
     e.stopPropagation();
     handleAction(row);
   }}
   ```

2. **Multiple Elements**: Combine components in one cell
   ```typescript
   renderCell: (row) => (
     <div style={{ display: 'flex', gap: '6px' }}>
       <Component1 />
       <Component2 />
     </div>
   )
   ```

3. **Custom Styling**: Override default styles
   ```typescript
   renderCell: (row) => (
     <div style={{ customStyle }}>
       <Component />
     </div>
   )
   ```

## Demo

Run the demo to see all cell renderers in action:
- Navigate to "Cell Renderers" tab in the application
- Explore interactive examples with all components
- View usage examples and code snippets

## Full Documentation

See [CELL_RENDERER_FRAMEWORK.md](./CELL_RENDERER_FRAMEWORK.md) for complete documentation.
