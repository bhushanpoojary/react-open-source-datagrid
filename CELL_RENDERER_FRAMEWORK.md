# Cell Renderer Framework

## Overview

The Cell Renderer Framework enables custom rendering of cell content in the DataGrid, allowing you to display rich, interactive components instead of plain text. This is essential for SaaS dashboards and modern data applications.

## Features

- **Custom Components**: Render any React component in cells
- **Pre-built Renderers**: Ready-to-use components for common use cases
- **Type-Safe**: Full TypeScript support
- **Interactive**: Support for buttons, links, and event handlers
- **Performant**: Optimized rendering with virtual scrolling support

## Basic Usage

### Defining Custom Cell Renderers

Add a `renderCell` function to your column definition:

```typescript
import { DataGrid, StatusChip } from './DataGrid';

const columns: Column[] = [
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (row) => <StatusChip status={row.status} />
  }
];

<DataGrid columns={columns} rows={data} />
```

## Built-in Cell Renderers

### 1. StatusChip

Color-coded status badges with automatic styling based on status value.

```typescript
{
  field: 'status',
  headerName: 'Status',
  renderCell: (row) => <StatusChip status={row.status} />
}
```

**Supported Status Values:**
- `active` - Green badge
- `inactive` - Red badge
- `pending` - Yellow badge
- `completed` - Blue badge
- Custom - Gray badge (default)

### 2. ProgressBar

Visual progress indicator with percentage label.

```typescript
{
  field: 'progress',
  headerName: 'Progress',
  renderCell: (row) => (
    <ProgressBar 
      value={row.progress}
      color="#3b82f6"
      showLabel={true}
    />
  )
}
```

**Props:**
- `value` (number): Progress value (0-100)
- `color?` (string): Bar color (default: '#3b82f6')
- `showLabel?` (boolean): Show percentage label (default: true)

### 3. IconCell

Display cells with icons and optional text.

```typescript
{
  field: 'type',
  headerName: 'Type',
  renderCell: (row) => (
    <IconCell 
      icon="📄"
      text={row.type}
      iconColor="#3b82f6"
    />
  )
}
```

**Props:**
- `icon` (string): Icon character/emoji
- `text?` (string): Optional text label
- `iconColor?` (string): Icon color

### 4. ImageCell

Display avatar or image with optional text label.

```typescript
{
  field: 'user',
  headerName: 'User',
  renderCell: (row) => (
    <ImageCell 
      src={row.avatarUrl}
      alt={row.userName}
      text={row.userName}
      size={32}
    />
  )
}
```

**Props:**
- `src` (string): Image URL
- `alt` (string): Alt text
- `text?` (string): Optional text label
- `size?` (number): Image size in pixels (default: 32)

### 5. ButtonCell

Actionable button in cell with multiple variants.

```typescript
{
  field: 'actions',
  headerName: 'Actions',
  renderCell: (row) => (
    <ButtonCell 
      label="Edit"
      onClick={() => handleEdit(row)}
      variant="primary"
      disabled={false}
    />
  )
}
```

**Props:**
- `label` (string): Button text
- `onClick` (function): Click handler
- `variant?` ('primary' | 'secondary' | 'danger'): Button style
- `disabled?` (boolean): Disabled state

**Variants:**
- `primary` - Blue button
- `secondary` - White button with border
- `danger` - Red button

### 6. BadgeCell

Generic badge component with custom colors.

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

**Props:**
- `text` (string): Badge text
- `color?` (string): Text color (default: '#1f2937')
- `backgroundColor?` (string): Background color (default: '#f3f4f6')

### 7. PriorityIndicator

Priority level with color indicator.

```typescript
{
  field: 'priority',
  headerName: 'Priority',
  renderCell: (row) => <PriorityIndicator priority={row.priority} />
}
```

**Props:**
- `priority` ('low' | 'medium' | 'high' | 'critical'): Priority level

**Priority Levels:**
- `low` - Green indicator
- `medium` - Orange indicator
- `high` - Red indicator
- `critical` - Dark red indicator

### 8. Rating

Star rating display.

```typescript
{
  field: 'rating',
  headerName: 'Rating',
  renderCell: (row) => (
    <Rating 
      rating={row.rating}
      maxRating={5}
    />
  )
}
```

**Props:**
- `rating` (number): Rating value (0-5)
- `maxRating?` (number): Maximum rating (default: 5)

### 9. CurrencyCell

Formatted currency display with locale support.

```typescript
{
  field: 'budget',
  headerName: 'Budget',
  renderCell: (row) => (
    <CurrencyCell 
      amount={row.budget}
      currency="USD"
      locale="en-US"
    />
  )
}
```

**Props:**
- `amount` (number): Currency amount
- `currency?` (string): Currency code (default: 'USD')
- `locale?` (string): Locale string (default: 'en-US')

## Multiple Actions in One Cell

You can combine multiple renderers in a single cell:

```typescript
{
  field: 'actions',
  headerName: 'Actions',
  renderCell: (row) => (
    <div style={{ display: 'flex', gap: '6px' }}>
      <ButtonCell 
        label="View" 
        onClick={() => handleView(row)}
        variant="secondary"
      />
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

## Custom Cell Renderers

Create your own custom cell renderers:

```typescript
// Custom cell renderer component
const CustomCell: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>{data.icon}</span>
      <span>{data.label}</span>
    </div>
  );
};

// Use in column definition
{
  field: 'custom',
  headerName: 'Custom',
  renderCell: (row) => <CustomCell data={row.customData} />
}
```

## Event Handling

Cell renderers can include interactive elements:

```typescript
const handleButtonClick = (row: Row, e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent row selection
  console.log('Button clicked for row:', row);
  // Your logic here
};

{
  field: 'actions',
  headerName: 'Actions',
  renderCell: (row) => (
    <ButtonCell 
      label="Action"
      onClick={(e) => handleButtonClick(row, e)}
    />
  )
}
```

## Best Practices

1. **Performance**: Keep cell renderers lightweight for optimal performance with large datasets
2. **Stop Propagation**: Use `e.stopPropagation()` in click handlers to prevent row selection
3. **Memoization**: Consider using `React.memo()` for complex custom renderers
4. **Consistency**: Use consistent styling across cell renderers
5. **Accessibility**: Ensure interactive elements are keyboard accessible

## Real-World Examples

### SaaS Dashboard

```typescript
const columns: Column[] = [
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
  },
  {
    field: 'subscription',
    headerName: 'Plan',
    renderCell: (row) => (
      <BadgeCell 
        text={row.plan}
        backgroundColor={row.plan === 'Pro' ? '#dcfce7' : '#f3f4f6'}
        color={row.plan === 'Pro' ? '#15803d' : '#374151'}
      />
    )
  },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (row) => <StatusChip status={row.status} />
  },
  {
    field: 'usage',
    headerName: 'Usage',
    renderCell: (row) => <ProgressBar value={row.usage} />
  },
  {
    field: 'mrr',
    headerName: 'MRR',
    renderCell: (row) => <CurrencyCell amount={row.mrr} />
  }
];
```

### Project Management

```typescript
const columns: Column[] = [
  {
    field: 'project',
    headerName: 'Project',
    renderCell: (row) => (
      <IconCell 
        icon={row.icon}
        text={row.projectName}
      />
    )
  },
  {
    field: 'priority',
    headerName: 'Priority',
    renderCell: (row) => <PriorityIndicator priority={row.priority} />
  },
  {
    field: 'progress',
    headerName: 'Progress',
    renderCell: (row) => <ProgressBar value={row.progress} />
  },
  {
    field: 'rating',
    headerName: 'Rating',
    renderCell: (row) => <Rating rating={row.rating} />
  }
];
```

## API Reference

### Column Interface

```typescript
interface Column {
  field: string;
  headerName: string;
  width?: number;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pinnable?: boolean;
  renderCell?: (row: Row) => React.ReactNode; // Custom cell renderer
}
```

## Import Path

```typescript
import {
  DataGrid,
  StatusChip,
  ProgressBar,
  IconCell,
  ImageCell,
  ButtonCell,
  BadgeCell,
  PriorityIndicator,
  Rating,
  CurrencyCell,
} from './components/DataGrid';
```

## Browser Support

All cell renderers are compatible with modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Notes

- Cell renderers work seamlessly with all DataGrid features (sorting, filtering, grouping, virtual scrolling)
- Custom renderers are preserved during export operations (exported as text values)
- Interactive elements in cells do not interfere with keyboard navigation
- Cell renderers support both light and dark themes (when implemented)
