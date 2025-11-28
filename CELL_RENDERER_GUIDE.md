# Cell Renderer Framework - Complete Guide

## 🎯 What is the Cell Renderer Framework?

The Cell Renderer Framework allows you to render **custom React components** inside DataGrid cells instead of plain text. This is essential for building modern SaaS dashboards with rich, interactive data visualizations.

## ⚡ Quick Examples

### Before (Plain Text)
```typescript
{ field: 'status', headerName: 'Status' }
// Displays: "Active"
```

### After (Custom Renderer)
```typescript
{ 
  field: 'status', 
  headerName: 'Status',
  renderCell: (row) => <StatusChip status={row.status} />
}
// Displays: [Green Badge: Active]
```

## 📦 Available Components

| Component | What it does | Example |
|-----------|-------------|---------|
| `StatusChip` | Color-coded status badges | 🟢 Active, 🔴 Inactive |
| `ProgressBar` | Visual progress (0-100%) | [████░░░░░░] 40% |
| `ImageCell` | Avatar with name | 👤 John Doe |
| `ButtonCell` | Clickable action button | [Edit] [Delete] |
| `BadgeCell` | Generic colored badge | [Premium] |
| `IconCell` | Icon + text | 📄 Document |
| `PriorityIndicator` | Priority with color | 🔴 High |
| `Rating` | Star ratings | ★★★★☆ |
| `CurrencyCell` | Formatted money | $50,000 |

## 🚀 Getting Started

### Step 1: Import Components
```typescript
import { DataGrid, StatusChip, ProgressBar, ButtonCell } from 'react-open-source-grid';
```

### Step 2: Add to Column Definition
```typescript
const columns: Column[] = [
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (row) => <StatusChip status={row.status} />
  }
];
```

### Step 3: Use DataGrid
```typescript
<DataGrid columns={columns} rows={data} />
```

## 💡 Common Patterns

### Pattern 1: Status Badge
```typescript
{
  field: 'status',
  headerName: 'Status',
  renderCell: (row) => <StatusChip status={row.status} />
}
```

### Pattern 2: User Avatar
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

### Pattern 3: Progress Tracker
```typescript
{
  field: 'completion',
  headerName: 'Progress',
  renderCell: (row) => <ProgressBar value={row.completion} />
}
```

### Pattern 4: Action Buttons
```typescript
{
  field: 'actions',
  headerName: 'Actions',
  renderCell: (row) => (
    <ButtonCell 
      label="Edit" 
      onClick={() => handleEdit(row)}
      variant="primary"
    />
  )
}
```

### Pattern 5: Multiple Buttons
```typescript
{
  field: 'actions',
  headerName: 'Actions',
  renderCell: (row) => (
    <div style={{ display: 'flex', gap: '6px' }}>
      <ButtonCell label="View" onClick={() => handleView(row)} variant="secondary" />
      <ButtonCell label="Edit" onClick={() => handleEdit(row)} variant="primary" />
      <ButtonCell label="Delete" onClick={() => handleDelete(row)} variant="danger" />
    </div>
  )
}
```

### Pattern 6: Currency Display
```typescript
{
  field: 'revenue',
  headerName: 'Revenue',
  renderCell: (row) => <CurrencyCell amount={row.revenue} />
}
```

### Pattern 7: Priority Level
```typescript
{
  field: 'priority',
  headerName: 'Priority',
  renderCell: (row) => <PriorityIndicator priority={row.priority} />
}
```

### Pattern 8: Star Rating
```typescript
{
  field: 'rating',
  headerName: 'Rating',
  renderCell: (row) => <Rating rating={row.rating} />
}
```

## 🎨 Complete Example: SaaS Dashboard

```typescript
import { 
  DataGrid, 
  StatusChip, 
  ProgressBar, 
  ImageCell,
  CurrencyCell,
  ButtonCell 
} from './DataGrid';

const columns: Column[] = [
  {
    field: 'customer',
    headerName: 'Customer',
    width: 220,
    renderCell: (row) => (
      <ImageCell 
        src={row.avatar}
        alt={row.customerName}
        text={row.customerName}
      />
    )
  },
  {
    field: 'subscription',
    headerName: 'Plan',
    width: 120,
    renderCell: (row) => <StatusChip status={row.plan} />
  },
  {
    field: 'usage',
    headerName: 'Usage',
    width: 150,
    renderCell: (row) => <ProgressBar value={row.usage} />
  },
  {
    field: 'mrr',
    headerName: 'MRR',
    width: 120,
    renderCell: (row) => <CurrencyCell amount={row.mrr} />
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (row) => (
      <div style={{ display: 'flex', gap: '6px' }}>
        <ButtonCell 
          label="View" 
          onClick={() => viewCustomer(row.id)}
          variant="secondary"
        />
        <ButtonCell 
          label="Manage" 
          onClick={() => manageSubscription(row.id)}
          variant="primary"
        />
      </div>
    )
  }
];

const data = [
  {
    id: 1,
    customerName: 'Acme Corp',
    avatar: 'https://example.com/avatar1.jpg',
    plan: 'Pro',
    usage: 75,
    mrr: 499
  },
  // ... more data
];

function Dashboard() {
  return <DataGrid columns={columns} rows={data} />;
}
```

## 🔧 Component Props Reference

### StatusChip
```typescript
<StatusChip status="Active" />
```
- Supports: active, inactive, pending, completed
- Auto-colors based on status

### ProgressBar
```typescript
<ProgressBar 
  value={75}              // 0-100
  color="#3b82f6"         // Optional
  showLabel={true}        // Optional
/>
```

### ImageCell
```typescript
<ImageCell 
  src="url"               // Required
  alt="alt text"          // Required
  text="Label"            // Optional
  size={32}               // Optional (default: 32)
/>
```

### ButtonCell
```typescript
<ButtonCell 
  label="Edit"            // Required
  onClick={handleClick}   // Required
  variant="primary"       // Optional: primary | secondary | danger
  disabled={false}        // Optional
/>
```

### BadgeCell
```typescript
<BadgeCell 
  text="Premium"          // Required
  color="#3730a3"         // Optional
  backgroundColor="#e0e7ff" // Optional
/>
```

### PriorityIndicator
```typescript
<PriorityIndicator priority="high" />
```
- Values: low, medium, high, critical

### Rating
```typescript
<Rating 
  rating={4}              // Required (0-5)
  maxRating={5}           // Optional (default: 5)
/>
```

### CurrencyCell
```typescript
<CurrencyCell 
  amount={50000}          // Required
  currency="USD"          // Optional (default: USD)
  locale="en-US"          // Optional (default: en-US)
/>
```

### IconCell
```typescript
<IconCell 
  icon="📄"               // Required
  text="Document"         // Optional
  iconColor="#3b82f6"     // Optional
/>
```

## 🎯 Event Handling

### Preventing Row Selection
When clicking buttons, prevent the row from being selected:

```typescript
<ButtonCell 
  label="Action"
  onClick={(e) => {
    e.stopPropagation(); // Prevents row selection
    handleAction(row);
  }}
/>
```

### Handling Multiple Actions
```typescript
const handleView = (row: Row) => {
  console.log('Viewing:', row.id);
};

const handleEdit = (row: Row) => {
  console.log('Editing:', row.id);
};

// In column definition:
renderCell: (row) => (
  <div style={{ display: 'flex', gap: '6px' }}>
    <ButtonCell label="View" onClick={() => handleView(row)} />
    <ButtonCell label="Edit" onClick={() => handleEdit(row)} />
  </div>
)
```

## 🎨 Creating Custom Renderers

You can create your own custom cell renderers:

```typescript
// 1. Create component
const CustomChip: React.FC<{ data: any }> = ({ data }) => (
  <span style={{
    padding: '4px 12px',
    borderRadius: '12px',
    backgroundColor: data.color,
    color: 'white',
    fontSize: '12px'
  }}>
    {data.label}
  </span>
);

// 2. Use in column
{
  field: 'customField',
  headerName: 'Custom',
  renderCell: (row) => <CustomChip data={row.customData} />
}
```

## ✅ Best Practices

1. **Keep it Simple**: Lightweight renderers perform better
2. **Stop Propagation**: Prevent unwanted row selection on button clicks
3. **Consistent Styling**: Use consistent colors and sizes
4. **Type Safety**: Leverage TypeScript for prop validation
5. **Accessibility**: Ensure keyboard and screen reader support

## 🚀 Live Demo

Run the application and navigate to the "Cell Renderers" tab to see all components in action:

```bash
npm run dev
```

Open http://localhost:5174 and click "Cell Renderers"

## 📚 Documentation Files

- **Full Guide**: `CELL_RENDERER_FRAMEWORK.md`
- **Quick Reference**: `CELL_RENDERER_QUICK_REF.md`
- **Implementation**: `CELL_RENDERER_IMPLEMENTATION.md`
- **Checklist**: `CELL_RENDERER_CHECKLIST.md`

## 🎉 You're Ready!

The Cell Renderer Framework is production-ready and provides everything you need to build modern, interactive data grids for SaaS dashboards.

Happy coding! 🚀
