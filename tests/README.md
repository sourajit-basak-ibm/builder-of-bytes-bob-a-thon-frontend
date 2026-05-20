# Playwright Automated Tests

This directory contains automated end-to-end tests for the Candidate Onboarding Application using Playwright.

## Features

- ✅ **Complete Workflow Testing**: Tests the entire hiring workflow from project creation to onboarding
- 🎥 **Video Recording**: All tests are recorded with video for documentation and debugging
- 📸 **Screenshots**: Automatic screenshots on test failures
- 📊 **HTML Reports**: Detailed test reports with traces and videos
- 🔄 **Automatic Retry**: Tests retry on failure in CI environments

## Prerequisites

Before running tests, ensure:

1. **Backend API is running** on `http://localhost:8080`
2. **Frontend dev server** will be started automatically by Playwright
3. **Database is properly configured** and accessible

## Installation

Playwright and dependencies are already installed. If you need to reinstall:

```bash
npm install -D @playwright/test @types/node
npx playwright install
```

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Specific Test File

```bash
npx playwright test tests/complete-workflow.spec.ts
```

### Run Tests with Debug Mode

```bash
npx playwright test --debug
```

## Test Structure

### Complete Workflow Test (`complete-workflow.spec.ts`)

This test covers the entire candidate onboarding workflow:

1. **Create Project** - Digital Wallet Platform with React, TypeScript, Node.js stack
2. **Create Candidate** - Alex Martinez with full-stack skills
3. **Create Staffing Request** - High priority request with mandatory skills
4. **Match Candidates** - Verify candidate matching algorithm
5. **Schedule Interview** - Technical interview with panel members
6. **Complete Interview** - Score 85/100 (above threshold)
7. **Schedule Face-to-Face Meeting** - Final round meeting
8. **Complete Meeting** - With agreement reached
9. **Initiate Onboarding** - Start onboarding process
10. **Update Onboarding Progress** - Set progress to 25%

**Duration**: ~3 minutes
**Video**: Automatically recorded to `test-results/`

## Video Recordings

All test runs are recorded with video. Videos are saved to:

```
test-results/
  complete-workflow-chromium/
    video.webm
```

### Viewing Videos

1. After test run, navigate to `test-results/` directory
2. Find the test folder (e.g., `complete-workflow-chromium`)
3. Open `video.webm` in any video player or browser

### Video Configuration

Videos are configured in `playwright.config.ts`:

```typescript
video: 'on',  // Always record
viewport: { width: 1920, height: 1080 },  // Full HD resolution
```

## Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:
- Test results and duration
- Screenshots of failures
- Video recordings
- Trace viewer for debugging

### JSON Report

Test results are also saved as JSON:

```
test-results/results.json
```

## Debugging Tests

### Using Playwright Inspector

```bash
npx playwright test --debug
```

This opens the Playwright Inspector where you can:
- Step through test actions
- Inspect page elements
- View console logs
- Record new tests

### Using Trace Viewer

If a test fails, view the trace:

```bash
npx playwright show-trace test-results/trace.zip
```

## Test Data

The test uses the following data (from TESTING_GUIDE.md):

### Project
- Name: Digital Wallet Platform
- Technologies: React, TypeScript, Node.js, PostgreSQL, Docker
- Status: ACTIVE
- Manager: Sarah Johnson

### Candidate
- Name: Alex Martinez
- Email: alex.martinez@example.com
- Phone: +1 (555) 123-4567
- Skills: React (Advanced), TypeScript (Advanced), Node.js (Intermediate), PostgreSQL (Intermediate)

### Interview
- Type: TECHNICAL
- Duration: 90 minutes
- Panel: Sarah Johnson, Michael Chen
- Score: 85/100

### Meeting
- Location: Building A, 5th Floor, Conference Room 502
- Agreement: Reached

### Onboarding
- Training Program: Full Stack Developer Onboarding Program
- Initial Progress: 25%

## Continuous Integration

The tests are configured for CI environments:

```typescript
// playwright.config.ts
forbidOnly: !!process.env.CI,  // Fail if test.only in CI
retries: process.env.CI ? 2 : 0,  // Retry failed tests in CI
workers: process.env.CI ? 1 : 1,  // Single worker in CI
```

### Running in CI

```bash
CI=true npm run test:e2e
```

## Troubleshooting

### Test Fails: "Backend not available"

**Solution**: Ensure backend is running on `http://localhost:8080`

```bash
# Check backend health
curl http://localhost:8080/api/health
```

### Test Fails: "Element not found"

**Solution**: 
1. Check if UI has changed
2. Update selectors in test file
3. Increase timeout if needed

### Video Not Recording

**Solution**: 
1. Verify FFmpeg is installed: `npx playwright install ffmpeg`
2. Check `playwright.config.ts` has `video: 'on'`
3. Ensure sufficient disk space

### Tests Run Slowly

**Solution**:
1. Reduce viewport size in config
2. Disable video for faster runs: `video: 'off'`
3. Use `--workers=1` for sequential execution

## Best Practices

1. **Keep Tests Independent**: Each test should be able to run independently
2. **Use Meaningful Selectors**: Prefer data-testid or role-based selectors
3. **Add Waits**: Use `waitForTimeout` or `waitForSelector` for dynamic content
4. **Clean Up**: Tests should clean up created data (if possible)
5. **Document Changes**: Update tests when UI changes

## Adding New Tests

To add a new test:

1. Create a new file in `tests/` directory:
   ```typescript
   // tests/my-feature.spec.ts
   import { test, expect } from '@playwright/test';
   
   test('my feature test', async ({ page }) => {
     await page.goto('/');
     // Your test code
   });
   ```

2. Run the new test:
   ```bash
   npx playwright test tests/my-feature.spec.ts
   ```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [TESTING_GUIDE.md](../TESTING_GUIDE.md) - Manual testing guide

## Support

For issues or questions:
1. Check test logs in console
2. View video recording of failed test
3. Use Playwright Inspector for debugging
4. Refer to TESTING_GUIDE.md for expected behavior

---

**Happy Testing! 🎭**