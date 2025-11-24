# Testing Quick Start

Get up and running with tests in 5 minutes!

## 🚀 Install Test Dependencies

```bash
npm install
```

This installs:
- Cypress 13.x
- Playwright 1.48.x
- All necessary dependencies

## ⚡ Quick Commands

### Run Everything
```bash
npm test
```

### Playwright (Recommended for CI/CD)
```bash
# Run all tests headless
npm run test:playwright

# Interactive UI mode (great for debugging)
npm run test:playwright:ui

# View last test report
npm run test:playwright:report
```

### Cypress (Recommended for Development)
```bash
# Open interactive test runner
npm run test:cypress:open

# Run headless
npm run test:cypress
```

## 📁 Test Structure

```
project/
├── cypress/
│   ├── e2e/              # End-to-end tests
│   │   ├── navigation.cy.ts
│   │   ├── datagrid-basic.cy.ts
│   │   ├── virtual-scrolling.cy.ts
│   │   ├── filtering.cy.ts
│   │   ├── tree-data.cy.ts
│   │   └── market-data.cy.ts
│   └── support/          # Custom commands & config
│       ├── commands.ts
│       └── e2e.ts
├── tests/
│   └── playwright/       # Cross-browser tests
│       ├── navigation.spec.ts
│       ├── datagrid.spec.ts
│       ├── performance.spec.ts
│       └── accessibility.spec.ts
├── cypress.config.ts     # Cypress configuration
└── playwright.config.ts  # Playwright configuration
```

## 🎯 What Gets Tested?

### Core Features ✅
- Grid rendering with data
- Column sorting
- Row selection
- Column resizing
- Virtual scrolling (1M+ rows)

### Advanced Features ✅
- Column filters (text, number, date)
- Tree data expand/collapse
- Market data live updates
- Faceted search
- Navigation & routing

### Quality Checks ✅
- Accessibility (ARIA, keyboard)
- Performance (60 FPS scrolling)
- Cross-browser (Chrome, Firefox, Safari)

## 🐛 Debugging Tests

### Cypress
1. Open test runner: `npm run test:cypress:open`
2. Click on any test file
3. See tests run in real browser
4. Use Chrome DevTools for debugging

### Playwright
1. Run with UI: `npm run test:playwright:ui`
2. See visual timeline of test execution
3. Click on any step to see screenshot
4. Inspect DOM at any point

## 📊 CI/CD Integration

Tests run automatically on GitHub Actions:
- Every PR
- Every push to main
- Results appear as checks ✅ or ❌

See `.github/workflows/test.yml`

## 🎮 Try the Playground

### Feature Gallery
Visit `/gallery` or click "Feature Gallery" in the sidebar to:
- Browse all 14+ features
- Search and filter
- Click to view live demos

### Benchmark Page
Visit `/benchmark` or click "Benchmark (1M rows)" to:
- Test with 10K - 10M rows
- Measure scroll performance
- See real-time FPS metrics

## 💡 Tips

1. **Start dev server first** for Cypress:
   ```bash
   npm run dev
   # In another terminal:
   npm run test:cypress:open
   ```

2. **Playwright starts server automatically**:
   ```bash
   npm run test:playwright
   # Server auto-starts and stops
   ```

3. **Focus on one test**:
   ```typescript
   it.only('my focused test', () => {
     // Only this test runs
   });
   ```

4. **Skip flaky tests temporarily**:
   ```typescript
   it.skip('flaky test', () => {
     // Skipped for now
   });
   ```

## 🔗 Next Steps

- Read [TESTING_PLAYGROUND.md](./TESTING_PLAYGROUND.md) for full details
- Check [Cypress docs](https://docs.cypress.io/)
- Check [Playwright docs](https://playwright.dev/)
- Add your own tests!

## 🆘 Troubleshooting

### "Cannot find module '@playwright/test'"
```bash
npm install
```

### "Cypress binary not found"
```bash
npx cypress install
```

### Tests timeout
Increase timeout in config files:
- `cypress.config.ts`: `defaultCommandTimeout: 10000`
- `playwright.config.ts`: `timeout: 30000`

### Port already in use
Change port in config or kill existing process:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill
```

---

**Happy Testing! 🎉**
