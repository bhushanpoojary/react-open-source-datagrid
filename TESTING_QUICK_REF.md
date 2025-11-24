# Testing & Playground - Quick Reference

## ⚡ One-Line Commands

```bash
# Run everything
npm test

# Interactive testing (best for development)
npm run test:cypress:open

# UI mode (best for debugging)
npm run test:playwright:ui

# Quick E2E check
npm run test:cypress

# Cross-browser check
npm run test:playwright
```

## 📁 Where Things Are

```
cypress/e2e/           → E2E test files
tests/playwright/      → Cross-browser tests
src/components/        → BenchmarkDemo, FeatureGallery
.github/workflows/     → CI/CD configuration
```

## 🎮 Try the Playground

1. `npm run dev`
2. Click **"Feature Gallery"** in sidebar
3. Click **"Benchmark (1M rows)"** in sidebar

## 📊 What Gets Tested

✅ Navigation & Search  
✅ DataGrid (render, sort, select)  
✅ Virtual Scrolling  
✅ Filtering  
✅ Tree Data  
✅ Market Data  
✅ Accessibility  

## 🔧 Quick Fixes

**Tests won't run?**
```bash
npm install
```

**Port in use?**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Cypress binary missing?**
```bash
npx cypress install
```

## 📖 Full Docs

- **Quick Start**: `TESTING_QUICKSTART.md`
- **Full Guide**: `TESTING_PLAYGROUND.md`
- **Implementation**: `TEST_IMPLEMENTATION_SUMMARY.md`

## 🎯 Common Tasks

### Add a New Test
1. Create file: `cypress/e2e/my-feature.cy.ts`
2. Write test following existing patterns
3. Run: `npm run test:cypress:open`

### Debug Failing Test
1. Run: `npm run test:cypress:open`
2. Click test file
3. See test run in browser
4. Use Chrome DevTools

### View Test Report
```bash
npm run test:playwright
npm run test:playwright:report
```

## 🚀 CI/CD

Tests run automatically on:
- Every pull request
- Every push to main
- See results in GitHub Actions tab

## 💡 Tips

- Use `.only` to focus on one test
- Use `.skip` to skip flaky tests
- Add `data-testid` to elements for stable selectors
- Keep tests simple and focused

---

**Need help? Check the full docs!**
