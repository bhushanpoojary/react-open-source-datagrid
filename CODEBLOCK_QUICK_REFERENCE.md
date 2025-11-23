# CodeBlock Component - Quick Reference

## Import

```tsx
import { CodeBlock } from './components/CodeBlock';
```

## Basic Usage

```tsx
<CodeBlock
  code={`const greeting = 'Hello, World!';
console.log(greeting);`}
  language="typescript"
  title="Simple Example"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | *required* | The code string to display |
| `language` | `string` | `'tsx'` | Programming language for syntax highlighting |
| `title` | `string` | `'{LANGUAGE} Code'` | Title shown in the header bar |
| `showLineNumbers` | `boolean` | `true` | Whether to show line numbers |
| `maxHeight` | `string` | `'500px'` | Maximum height before scrolling |

## Supported Languages

- `tsx` / `typescript` - TypeScript/TSX
- `javascript` / `jsx` - JavaScript/JSX
- `json` - JSON
- `css` - CSS
- `html` - HTML
- `python` - Python
- `bash` - Shell scripts
- And many more...

## Examples

### TypeScript Example

```tsx
<CodeBlock
  title="TypeScript Configuration"
  language="typescript"
  code={`interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};`}
/>
```

### JSON Example

```tsx
<CodeBlock
  title="API Response"
  language="json"
  code={`{
  "status": "success",
  "data": {
    "users": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ]
  }
}`}
/>
```

### React Component Example

```tsx
<CodeBlock
  title="React Component"
  language="tsx"
  code={`import React from 'react';

export const MyComponent: React.FC = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};`}
/>
```

### Without Line Numbers

```tsx
<CodeBlock
  title="Inline Command"
  language="bash"
  showLineNumbers={false}
  code={`npm install react-syntax-highlighter`}
/>
```

### Custom Height

```tsx
<CodeBlock
  title="Large Code File"
  language="typescript"
  maxHeight="300px"
  code={veryLongCodeString}
/>
```

## Visual Features

### Copy Button States

1. **Default State**: Blue button with "Copy" text and clipboard icon
2. **Hover State**: Darker blue with slight lift animation
3. **Clicked State**: Green button with "Copied!" text and checkmark icon
4. **Auto-reset**: Returns to default after 2 seconds

### Color Theme

Uses VS Code Dark+ theme:
- Background: Dark slate (#1e293b)
- Text: Light gray (#e2e8f0)
- Syntax highlighting with professional colors
- Clean borders and shadows

## Integration in Demo Pages

All demo components now use CodeBlock for code examples:

- ✅ InfiniteScrollDemo
- ✅ TreeDataDemo  
- ✅ LayoutPersistenceDemo
- ✅ CellRenderersDemo
- ✅ RowDraggingDemo
- ✅ VirtualScrollDemo
- ✅ ColumnFiltersDemo
- ✅ LiveMarketDemo
- ✅ ThemesDemo

## Tips

1. **Keep code examples concise** - Show the essential parts
2. **Use descriptive titles** - Help users understand the example
3. **Format code properly** - Use consistent indentation
4. **Test code strings** - Ensure they're valid and runnable
5. **Choose right language** - Match the syntax highlighting to content

## Accessibility

- Keyboard accessible copy button
- Screen reader friendly
- High contrast colors
- Clear focus indicators
- Semantic HTML structure
