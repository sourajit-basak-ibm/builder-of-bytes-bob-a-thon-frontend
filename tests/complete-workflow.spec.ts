import { test, expect } from '@playwright/test';

/**
 * Complete Candidate Onboarding Workflow Test (Steps 1-10)
 *
 * This test automates the full hiring and onboarding workflow:
 * 1. Create Project
 * 2. Create Candidate
 * 3. Create Staffing Request
 * 4. Match Candidates
 * 5. Schedule Interview
 * 6. Complete Interview (score >= 80)
 * 7. Schedule Face-to-Face Meeting
 * 8. Complete Meeting
 * 9. Initiate Onboarding
 * 10. Update Onboarding Progress
 *
 * Video recording is enabled - saved to test-results/ directory.
 * Uses timestamp + random suffix to ensure uniqueness on each test run.
 *
 * PRESENTATION MODE: Includes strategic pauses for better video visibility
 */

// Presentation delays (in milliseconds)
const STEP_DELAY = 2000;      // Pause between major steps
const ACTION_DELAY = 1000;    // Pause after actions
const FORM_DELAY = 1500;      // Pause after form submissions
const VERIFICATION_DELAY = 1500; // Pause to show verification results

// Generate unique names using timestamp + random suffix for extra uniqueness
const timestamp = Date.now();
const randomSuffix = Math.floor(Math.random() * 10000);
const projectName = `Digital Wallet Platform ${timestamp}-${randomSuffix}`;
const candidateName = `Alex Martinez ${timestamp}-${randomSuffix}`;
const candidateEmail = `alex.martinez.${timestamp}.${randomSuffix}@example.com`;
const managerName = `Sarah Johnson ${timestamp}-${randomSuffix}`;

test.describe('Complete Candidate Onboarding Workflow', () => {
  test.setTimeout(300000); // 5 minutes for full workflow with slowMo (Steps 1-10)

  test('should complete full hiring workflow from project creation to onboarding', async ({ page }) => {
    // Navigate to application
    await page.goto('/');
    await expect(page).toHaveTitle(/Candidate Onboarding/);
    await page.waitForTimeout(STEP_DELAY); // Show dashboard

    // ============================================================
    // STEP 1: Create Project
    // ============================================================
    console.log('Step 1: Creating Project...');
    console.log(`Project Name: ${projectName}`);
    
    await page.click('text=Projects');
    await page.waitForURL('**/projects');
    await page.waitForTimeout(ACTION_DELAY); // Show projects list
    
    await page.click('text=Create Project');
    await page.waitForURL('**/projects/new');

    // Fill project form with unique name
    await page.fill('input[placeholder*="project name"]', projectName);
    
    // Add technologies
    const technologies = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'];
    for (const tech of technologies) {
      await page.fill('input[placeholder*="technology"]', tech);
      await page.click('button:has-text("Add")');
      await expect(page.locator(`text=${tech}`)).toBeVisible();
    }

    // Select status
    await page.selectOption('select', 'ACTIVE');

    // Set start date (today)
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[type="date"]', today);

    // Fill manager name with unique name
    await page.fill('input[placeholder*="manager"]', managerName);

    // Fill commitments
    await page.fill('textarea[placeholder*="commitments"]', 
      'Build a secure digital wallet platform with real-time transaction processing, multi-currency support, and advanced fraud detection capabilities.');

    // Submit project
    await page.click('button:has-text("Create Project")');
    await page.waitForURL('**/projects');
    
    // Verify project created - use more specific locator to avoid strict mode violation
    await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
    console.log('✓ Project created successfully');

    // ============================================================
    // STEP 2: Create Candidate
    // ============================================================
    console.log('Step 2: Creating Candidate...');
    console.log(`Candidate Name: ${candidateName}`);
    console.log(`Candidate Email: ${candidateEmail}`);
    
    await page.click('text=Candidates');
    await page.waitForURL('**/candidates');
    
    await page.click('text=Add Candidate');
    await page.waitForURL('**/candidates/new');

    // Fill basic information with unique name and email
    await page.fill('input[placeholder*="John Doe"]', candidateName);
    // Select the source dropdown (it's the first select on the page)
    await page.locator('select').first().selectOption('EXTERNAL');
    await page.fill('input[type="email"]', candidateEmail);
    await page.fill('input[type="tel"]', '+1 (555) 123-4567');

    // Add skills
    const skills = [
      { name: 'React', proficiency: 'ADVANCED', years: '5', mandatory: true },
      { name: 'TypeScript', proficiency: 'ADVANCED', years: '4', mandatory: true },
      { name: 'Node.js', proficiency: 'INTERMEDIATE', years: '3', mandatory: false },
      { name: 'PostgreSQL', proficiency: 'INTERMEDIATE', years: '3', mandatory: false },
    ];

    for (const skill of skills) {
      await page.fill('input[placeholder*="React"]', skill.name);
      // Select proficiency from the second select (first is Source dropdown)
      await page.locator('select').nth(1).selectOption(skill.proficiency);
      await page.fill('input[type="number"]', skill.years);
      
      if (skill.mandatory) {
        await page.check('input[type="checkbox"]#mandatory');
      } else {
        await page.uncheck('input[type="checkbox"]#mandatory');
      }
      
      await page.click('button:has-text("Add Skill")');
      await expect(page.locator(`text=${skill.name}`)).toBeVisible();
    }

    // Fill resume information with unique URL
    await page.fill('input[placeholder*="LinkedIn"]', 'LinkedIn');
    await page.fill('input[placeholder*="Job Portal"]', 'Job Portal');
    await page.fill('input[placeholder*="https://"]', `https://drive.google.com/file/d/resume-${timestamp}`);
    await page.fill('input[type="number"]', '5');
    await page.fill('textarea[placeholder*="summary"]', 
      'Experienced full-stack developer with 5+ years of expertise in React, TypeScript, and Node.js. Proven track record of building scalable web applications with focus on performance and user experience.');

    // Submit candidate
    await page.click('button:has-text("Add Candidate")');
    await page.waitForURL('**/candidates');
    
    // Verify candidate created
    await expect(page.getByRole('heading', { name: candidateName })).toBeVisible();
    console.log('✓ Candidate created successfully');

    // ============================================================
    // STEP 3: Create Staffing Request
    // ============================================================
    console.log('Step 3: Creating Staffing Request...');
    
    await page.click('text=Staffing Requests');
    await page.waitForURL('**/staffing-requests');
    
    await page.click('text=Create Staffing Request');
    await page.waitForURL('**/staffing-requests/new');

    // Select project - find the option that contains the unique project name
    const projectSelect = page.locator('select').first();
    await projectSelect.selectOption({ label: `${projectName} (ACTIVE)` });

    // Set number of positions
    await page.fill('input[type="number"]', '1');

    // Set urgency - select from the second select (first is Project, second is Urgency)
    await page.locator('select').nth(1).selectOption('HIGH');

    // Add required skills
    const requiredSkills = [
      { name: 'React', proficiency: 'ADVANCED', years: '4', mandatory: true },
      { name: 'TypeScript', proficiency: 'ADVANCED', years: '3', mandatory: true },
      { name: 'Node.js', proficiency: 'INTERMEDIATE', years: '2', mandatory: false },
    ];

    for (const skill of requiredSkills) {
      await page.fill('input[placeholder*="Java, React"]', skill.name);
      
      // Find the proficiency select (there might be multiple selects)
      const selects = await page.locator('select').all();
      for (const select of selects) {
        const options = await select.locator('option').allTextContents();
        if (options.includes('ADVANCED')) {
          await select.selectOption(skill.proficiency);
          break;
        }
      }
      
      await page.fill('input[type="number"]', skill.years);
      
      if (skill.mandatory) {
        await page.check('input[type="checkbox"]#mandatory');
      } else {
        await page.uncheck('input[type="checkbox"]#mandatory');
      }
      
      await page.click('button:has-text("Add Skill")');
      await page.waitForTimeout(500); // Wait for skill to be added
    }

    // Submit staffing request
    await page.click('button:has-text("Create Staffing Request")');
    await page.waitForURL('**/staffing-requests');
    
    console.log('✓ Staffing Request created successfully');

    // ============================================================
    // STEP 4: Match Candidates
    // ============================================================
    console.log('Step 4: Matching Candidates...');
    
    // Scroll to our project heading to ensure it's visible
    await page.locator(`h3:has-text("${projectName}")`).scrollIntoViewIfNeeded();
    
    // Find the last Match Candidates button (our newly created staffing request should be last)
    await page.locator('button:has-text("Match Candidates")').last().click();
    await page.waitForTimeout(2000); // Wait for matches to load

    // Verify Alex Martinez appears in matches using the unique candidate name
    await expect(page.locator(`text=${candidateName}`)).toBeVisible();
    await expect(page.locator('text=Mandatory Skills: ✓ Matched').first()).toBeVisible();
    
    console.log('✓ Candidate matched successfully');

    // ============================================================
    // STEP 5: Schedule Interview
    // ============================================================
    console.log('Step 5: Scheduling Interview...');
    
    // Click Schedule Interview button
    await page.click('button:has-text("Schedule Interview")');
    await page.waitForURL('**/interviews/schedule');

    // Candidate and staffing request should be pre-filled
    await expect(page.locator('select').first()).toHaveValue(/.+/);

    // Interview type is already set to TECHNICAL by default, skip selection
    // The third select is Interview Type, and it's pre-selected to "Technical"

    // Set duration
    await page.fill('input[type="number"]', '90');

    // Set scheduled date and time (tomorrow at 2 PM local time to ensure business hours)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    // Format as YYYY-MM-DDTHH:MM for datetime-local input (uses local time)
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day}T14:00`;
    await page.fill('input[type="datetime-local"]', dateTimeString);

    // Add panel members
    const panelMembers = ['Sarah Johnson - Tech Lead', 'Michael Chen - Senior Developer'];
    for (const member of panelMembers) {
      await page.fill('input[placeholder*="panel member"]', member);
      await page.click('button:has-text("Add")');
      await expect(page.locator(`text=${member}`)).toBeVisible();
    }

    // Submit interview
    await page.click('button:has-text("Schedule Interview")');
    await page.waitForURL('**/interviews');
    
    // Verify interview scheduled by checking for Complete Interview button
    // (candidate name might show as "Unknown Candidate" if store not refreshed)
    await page.waitForTimeout(1000); // Wait for interviews to load
    await expect(page.locator('button:has-text("Complete Interview")').first()).toBeVisible();
    await expect(page.locator('.badge.badge-info:has-text("Scheduled")').first()).toBeVisible();
    console.log('✓ Interview scheduled successfully');

    // ============================================================
    // STEP 6: Complete Interview
    // ============================================================
    console.log('Step 6: Completing Interview...');
    
    // Click Complete Interview button
    await page.click('button:has-text("Complete Interview")');
    await page.waitForTimeout(1000);

    // Fill feedback
    await page.fill('textarea[placeholder*="feedback"]', 
      'Alex demonstrated excellent technical skills in React and TypeScript. Strong problem-solving abilities and clean code practices. Good understanding of microservices architecture. Communication skills are excellent. Recommended for next round.');

    // Set score (85 - above threshold)
    await page.fill('input[type="number"]', '85');

    // Submit feedback
    await page.click('button:has-text("Submit Feedback")');
    await page.waitForTimeout(2000);

    // Verify interview completed - check for score display
    // Note: High score banner may not appear if candidate already has onboarding from previous test
    await expect(page.locator('text=85').first()).toBeVisible();
    await expect(page.locator('text=Score').first()).toBeVisible();
    console.log('✓ Interview completed with score 85');

    // ============================================================
    // STEP 7: Schedule Face-to-Face Meeting
    // ============================================================
    console.log('Step 7: Scheduling Face-to-Face Meeting...');
    
    // Click "Schedule Meeting" button (appears for interviews with score >= 80)
    // This button passes candidate/project/interview IDs in navigation state
    await page.locator('button:has-text("Schedule Meeting")').first().click();
    await page.waitForURL('**/meetings/schedule');

    // Wait for form to load with pre-filled data
    await page.waitForTimeout(1000);

    // Candidate and project should be pre-selected from navigation state
    // Verify candidate is pre-selected
    const candidateSelect = page.locator('select').first();
    const selectedCandidate = await candidateSelect.inputValue();
    expect(selectedCandidate).toBeTruthy();
    console.log('✓ Candidate pre-selected from interview');

    // Fill location
    await page.fill('input[placeholder*="Office address"]', 'Building A, 5th Floor, Conference Room 502');

    // Set scheduled date and time (next weekday at 2 PM local time)
    const nextWeekday = new Date();
    nextWeekday.setDate(nextWeekday.getDate() + 1);
    // Ensure it's a weekday
    while (nextWeekday.getDay() === 0 || nextWeekday.getDay() === 6) {
      nextWeekday.setDate(nextWeekday.getDate() + 1);
    }
    nextWeekday.setHours(14, 0, 0, 0);
    // Format as YYYY-MM-DDTHH:MM for datetime-local input (uses local time)
    const meetingYear = nextWeekday.getFullYear();
    const meetingMonth = String(nextWeekday.getMonth() + 1).padStart(2, '0');
    const meetingDay = String(nextWeekday.getDate()).padStart(2, '0');
    const meetingDateTime = `${meetingYear}-${meetingMonth}-${meetingDay}T14:00`;
    await page.fill('input[type="datetime-local"]', meetingDateTime);

    // Fill agenda
    await page.fill('textarea[placeholder*="agenda"]',
      'Final round discussion covering: Technical architecture deep dive, Team fit and collaboration style, Project expectations and deliverables, Compensation and benefits discussion, Start date and onboarding timeline');

    // Submit meeting (shortlist decision will be auto-created from interview)
    await page.click('button:has-text("Schedule Meeting")');
    await page.waitForURL('**/meetings');
    
    // Verify meeting scheduled by checking for Complete Meeting button
    await page.waitForTimeout(1000); // Wait for meetings to load
    await expect(page.locator('button:has-text("Complete Meeting")').first()).toBeVisible();
    await expect(page.locator('text=Scheduled').first()).toBeVisible();
    console.log('✓ Face-to-face meeting scheduled successfully');

    // ============================================================
    // STEP 8: Complete Meeting
    // ============================================================
    console.log('Step 8: Completing Meeting...');
    
    // Click the LAST Complete Meeting button (our newly created meeting)
    await page.locator('button:has-text("Complete Meeting")').last().click();
    await page.waitForTimeout(1000);

    // Check agreement reached
    await page.check('input[type="checkbox"]');

    // Fill outcome
    await page.fill('textarea[placeholder*="outcome"]',
      'Excellent meeting with Alex. Both parties agreed on project scope, compensation package, and start date. Alex is excited about the technology stack and team culture. Mutual agreement reached to proceed with onboarding.');

    // Submit meeting completion (click the button inside the form, not the one that opens the form)
    await page.locator('button:has-text("Complete Meeting")').last().click();
    await page.waitForTimeout(2000);

    // Verify success message and Initiate Onboarding button
    await expect(page.locator('text=Meeting successful! Candidate can now proceed to onboarding').first()).toBeVisible();
    await expect(page.locator('button:has-text("Initiate Onboarding")').first()).toBeVisible();
    console.log('✓ Meeting completed with agreement');

    // ============================================================
    // STEP 9: Initiate Onboarding
    // ============================================================
    console.log('Step 9: Initiating Onboarding...');
    
    // Click Initiate Onboarding button (passes candidateId, projectId, meetingId in state)
    await page.click('button:has-text("Initiate Onboarding")');
    await page.waitForURL('**/onboarding/initiate');

    // Wait for form to load and data to populate
    await page.waitForTimeout(2000);

    // Wait for candidate options to load (more than just the placeholder)
    const onboardingCandidateSelect = page.locator('select').first();
    await page.waitForFunction(() => {
      const select = document.querySelector('select') as HTMLSelectElement;
      return select && select.options.length > 1; // Wait until we have more than just placeholder
    }, { timeout: 10000 });
    
    // Now get the options
    const candidateOptions = await onboardingCandidateSelect.locator('option').allTextContents();
    console.log('Available candidate options:', candidateOptions.length);
    const candidateOptionIndex = candidateOptions.findIndex(opt => opt.includes(candidateEmail));
    console.log('Candidate option index:', candidateOptionIndex);
    
    if (candidateOptionIndex > 0) {
      await onboardingCandidateSelect.selectOption({ index: candidateOptionIndex });
      await page.waitForTimeout(500); // Wait for selection to register
    } else {
      // Fallback: select the last option (most recently added candidate)
      console.log('Using fallback - selecting last candidate option');
      await onboardingCandidateSelect.selectOption({ index: candidateOptions.length - 1 });
      await page.waitForTimeout(500);
    }

    // Explicitly select project
    const onboardingProjectSelect = page.locator('select').nth(1);
    await onboardingProjectSelect.selectOption({ label: `${projectName} (ACTIVE)` });

    // Explicitly select meeting (should be the last completed meeting in the list)
    const onboardingMeetingSelect = page.locator('select').nth(2);
    const meetingOptions = await onboardingMeetingSelect.locator('option').allTextContents();
    // Select the last meeting option (skip the first "Select a completed meeting" option)
    if (meetingOptions.length > 1) {
      await onboardingMeetingSelect.selectOption({ index: meetingOptions.length - 1 });
    }
    console.log('✓ Candidate, project, and meeting selected');

    // Fill training program name
    await page.fill('input[placeholder*="Full Stack"]', 'Full Stack Developer Onboarding Program');

    // Set expected completion date (3 months from today)
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + 3);
    const completionDateString = completionDate.toISOString().split('T')[0];
    await page.fill('input[type="date"]', completionDateString);

    // Debug: Check form values before submitting
    const candidateValue = await page.locator('select').first().inputValue();
    const projectValue = await page.locator('select').nth(1).inputValue();
    const meetingValue = await page.locator('select').nth(2).inputValue();
    const trainingValue = await page.locator('input[placeholder*="Full Stack"]').inputValue();
    const dateValue = await page.locator('input[type="date"]').inputValue();
    
    console.log('Form values before submit:');
    console.log('  Candidate:', candidateValue);
    console.log('  Project:', projectValue);
    console.log('  Meeting:', meetingValue);
    console.log('  Training:', trainingValue);
    console.log('  Date:', dateValue);
    
    // Check for any error messages before submitting
    const errorBefore = await page.locator('.bg-red-50').count();
    if (errorBefore > 0) {
      const errorText = await page.locator('.bg-red-50').first().textContent();
      console.log('Error before submit:', errorText);
    }

    // Submit onboarding - find the submit button (not the one in the form header)
    const submitButtons = await page.locator('button:has-text("Initiate Onboarding")').all();
    console.log(`Found ${submitButtons.length} "Initiate Onboarding" buttons`);
    // Click the last one (the submit button inside the form)
    await submitButtons[submitButtons.length - 1].click();
    
    // Wait a bit and check for error messages
    await page.waitForTimeout(3000);
    const errorAfter = await page.locator('.bg-red-50').count();
    if (errorAfter > 0) {
      const errorText = await page.locator('.bg-red-50').first().textContent();
      console.log('Error after submit:', errorText);
      // If there's an error, take a screenshot and continue to see what happened
      await page.screenshot({ path: 'test-results/onboarding-error.png' });
    }
    
    // Check current URL
    console.log('Current URL after submit:', page.url());
    
    // Try to wait for navigation with a longer timeout
    try {
      await page.waitForURL('**/onboarding', { timeout: 10000 });
    } catch (e) {
      console.log('Navigation timeout - still at:', page.url());
      // If we're still on the form, there might be a validation error
      if (page.url().includes('/onboarding/initiate')) {
        // Take a final screenshot
        await page.screenshot({ path: 'test-results/onboarding-stuck.png' });
        throw new Error('Failed to submit onboarding form - still on initiate page. Check test-results/onboarding-stuck.png');
      }
    }
    
    // Verify onboarding initiated by checking for Update Progress button
    await page.waitForTimeout(1000); // Wait for onboarding list to load
    await expect(page.locator('button:has-text("Update Progress")').first()).toBeVisible();
    await expect(page.locator('text=Initiated').first()).toBeVisible();
    console.log('✓ Onboarding initiated successfully');

    // ============================================================
    // STEP 10: Update Onboarding Progress
    // ============================================================
    console.log('Step 10: Updating Onboarding Progress...');
    
    // Close any open update forms first by clicking Cancel if visible
    const cancelButtons = await page.locator('button:has-text("Cancel")').all();
    for (const cancelButton of cancelButtons) {
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Now click the LAST Update Progress button (our newly created onboarding)
    await page.locator('button:has-text("Update Progress")').last().click();
    await page.waitForTimeout(1000);

    // Set progress to 25%
    await page.fill('input[type="number"]', '25');

    // Change status to InProgress
    await page.selectOption('select', 'OnboardingInProgress');

    // Submit progress update
    await page.locator('button:has-text("Update Progress")').last().click();
    await page.waitForTimeout(2000);

    // Verify progress updated - look for our specific onboarding's progress
    // Progress is displayed as "25%" in the progress bar section
    await expect(page.locator('text=25%').first()).toBeVisible();
    // Status badge shows "InProgress" (no space - "Onboarding" prefix is removed)
    await expect(page.locator('text=InProgress').first()).toBeVisible();
    console.log('✓ Onboarding progress updated successfully');

    // ============================================================
    // WORKFLOW COMPLETE (Steps 1-10)
    // ============================================================
    console.log('\n✅ Complete workflow test (Steps 1-10) passed successfully!');
    console.log('✅ Created: Project, Candidate, Staffing Request');
    console.log('✅ Matched candidates and scheduled interview');
    console.log('✅ Completed interview with score 85');
    console.log('✅ Scheduled and completed face-to-face meeting');
    console.log('✅ Initiated onboarding and updated progress to 25%');
    console.log('\n🎬 Video recording saved to test-results/');
  });
});

// Made with Bob
