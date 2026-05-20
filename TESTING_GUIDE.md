# Candidate Onboarding Application - Testing Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Application Setup](#application-setup)
3. [Complete Workflow Test](#complete-workflow-test)
4. [Validation Testing](#validation-testing)
5. [Business Rules Testing](#business-rules-testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Services
- ✅ Backend API running on `http://localhost:8080`
- ✅ Frontend application running on `http://localhost:3000`
- ✅ Database properly configured and accessible

### Test Data Requirements
- Valid email addresses
- Resume URLs (can use placeholder URLs like `https://drive.google.com/file/d/sample`)
- Future dates for scheduling

---

## Application Setup

### Starting the Application

1. **Start Backend** (if not already running):
   ```bash
   # Navigate to backend directory
   cd backend
   # Start the backend service
   ./mvnw spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   # Navigate to frontend directory
   cd builder-of-bytes-bob-a-thon-frontend
   # Install dependencies (first time only)
   npm install
   # Start development server
   npm run dev
   ```

3. **Access Application**:
   - Open browser: `http://localhost:3000`
   - Verify navigation menu shows: Dashboard, Projects, Candidates, Staffing Requests, Interviews, Meetings, Onboarding

---

## Complete Workflow Test

### Test Scenario: Hire a Full Stack Developer

Follow this step-by-step guide to test the complete hiring workflow from project creation to onboarding.

---

### Step 1: Create a Project

**Navigation:** Click "Projects" → "Create Project"

**Test Data:**
```
Project Name: Digital Wallet Platform
Technology Stack: 
  - React
  - TypeScript
  - Node.js
  - PostgreSQL
  - Docker
Status: ACTIVE
Start Date: [Select today's date or future date]
Manager Name: Sarah Johnson
Commitments: Build a secure digital wallet platform with real-time transaction processing, multi-currency support, and advanced fraud detection capabilities.
```

**Expected Results:**
- ✅ Form validates all required fields
- ✅ Technology stack shows as blue badges
- ✅ Character counter shows for commitments
- ✅ Project appears in Projects list after creation
- ✅ Success message or redirect to Projects list

**Validation Tests:**
- Try submitting without project name → Error: "Project name is required"
- Try name with < 3 characters → Error: "Project name must be at least 3 characters"
- Try adding duplicate technology → Error: "This technology is already added"
- Try commitments < 10 characters → Error: "Please provide more detailed commitments"

---

### Step 2: Create a Candidate

**Navigation:** Click "Candidates" → "Add Candidate"

**Test Data:**
```
Full Name: Alex Martinez
Source: EXTERNAL
Email: alex.martinez@example.com
Phone: +1 (555) 123-4567

Skills:
1. React
   - Proficiency: ADVANCED
   - Years of Experience: 5
   - Mandatory: ✓ (checked)

2. TypeScript
   - Proficiency: ADVANCED
   - Years of Experience: 4
   - Mandatory: ✓ (checked)

3. Node.js
   - Proficiency: INTERMEDIATE
   - Years of Experience: 3
   - Mandatory: ☐ (unchecked)

4. PostgreSQL
   - Proficiency: INTERMEDIATE
   - Years of Experience: 3
   - Mandatory: ☐ (unchecked)

Resume:
  Source Name: LinkedIn
  Source Type: Job Portal
  Resume URL: https://drive.google.com/file/d/alex-martinez-resume
  Total Experience: 5 years
  Summary: Experienced full-stack developer with 5+ years of expertise in React, TypeScript, and Node.js. Proven track record of building scalable web applications with focus on performance and user experience. Strong background in microservices architecture and cloud deployment.
```

**Expected Results:**
- ✅ Skills with mandatory flag show red badges
- ✅ Non-mandatory skills show blue badges
- ✅ Email validation prevents invalid formats
- ✅ Phone validation requires 10+ digits
- ✅ Resume summary character counter shows
- ✅ Candidate appears in Candidates list with status "CandidateSourced"

**Validation Tests:**
- Try invalid email → Error: "Please enter a valid email address"
- Try duplicate email → Error: "A candidate with this email already exists"
- Try phone < 10 digits → Error: "Please enter a valid phone number"
- Try resume summary < 20 chars → Error: "Please provide a more detailed summary"
- Try submitting without skills → Error: "At least one skill is required"

---

### Step 3: Create Staffing Request

**Navigation:** Click "Staffing Requests" → "Create Request"

**Test Data:**
```
Project: Digital Wallet Platform (ACTIVE)
Number of Positions: 1
Urgency: HIGH

Required Skills:
1. React
   - Proficiency: ADVANCED
   - Min. Years: 4
   - Mandatory: ✓ (checked)

2. TypeScript
   - Proficiency: ADVANCED
   - Min. Years: 3
   - Mandatory: ✓ (checked)

3. Node.js
   - Proficiency: INTERMEDIATE
   - Min. Years: 2
   - Mandatory: ☐ (unchecked)
```

**Expected Results:**
- ✅ Only ACTIVE/PLANNING projects shown in dropdown
- ✅ Mandatory skills show red badges with asterisk (*)
- ✅ Blue info box shows matching rules
- ✅ Warning if no mandatory skills: "⚠️ Consider marking at least one skill as mandatory"
- ✅ Staffing request appears in list with status "RequestOpen"

**Validation Tests:**
- Try positions < 1 → Error: "Number of positions must be at least 1"
- Try positions > 50 → Error: "Number of positions cannot exceed 50"
- Try submitting without skills → Error: "At least one skill is required"
- Try adding duplicate skill → Error: "This skill is already added"

---

### Step 4: Match Candidates

**Navigation:** Staffing Requests list → Click "Match Candidates" on the Digital Wallet Platform request

**Expected Results:**
- ✅ Alex Martinez appears in matches
- ✅ Match score displayed (should be > 70 for auto-consideration)
- ✅ "Mandatory Skills: ✓ Matched" shown
- ✅ "Auto-Considered" badge if score > 70
- ✅ "Schedule Interview" button visible
- ✅ If candidate already onboarded: Shows "Already Onboarded" badge, button hidden

**Business Rules Verified:**
- Candidates with score 0 are filtered out
- Mandatory skills must match for any candidate to appear
- Internal candidates get priority badge
- Candidates with active onboarding cannot be interviewed again

---

### Step 5: Schedule Interview

**Navigation:** Click "Schedule Interview" button from matched candidate

**Test Data:**
```
Candidate: Alex Martinez (alex.martinez@example.com) [Pre-filled]
Staffing Request: Request #[ID] - HIGH Priority [Pre-filled]
Interview Type: TECHNICAL
Duration: 90 minutes
Scheduled Date & Time: [Select tomorrow at 10:00 AM]

Panel Members:
  - Sarah Johnson - Tech Lead
  - Michael Chen - Senior Developer
  - Add both members one by one
```

**Expected Results:**
- ✅ Candidate and staffing request pre-filled from previous step
- ✅ Only non-rejected candidates shown in dropdown
- ✅ Only open/in-progress staffing requests shown
- ✅ Date/time picker prevents past dates
- ✅ Panel members show as blue badges
- ✅ Warning if technical interview has < 2 panel members
- ✅ Interview appears in Interviews list with status "InterviewScheduled"

**Validation Tests:**
- Try past date → Error: "Interview cannot be scheduled in the past"
- Try time before 9 AM or after 6 PM → Error: "Please schedule during business hours"
- Try duration < 15 minutes → Error: "Duration must be at least 15 minutes"
- Try duration > 240 minutes → Error: "Duration cannot exceed 4 hours"
- Try submitting without panel members → Error: "At least one panel member is required"
- Try duplicate panel member → Error: "This panel member is already added"

---

### Step 6: Complete Interview

**Navigation:** Interviews list → Click "Complete Interview" on Alex Martinez's interview

**Test Data:**
```
Feedback: Alex demonstrated excellent technical skills in React and TypeScript. Strong problem-solving abilities and clean code practices. Good understanding of microservices architecture. Communication skills are excellent. Recommended for next round.

Overall Score: 85
```

**Expected Results:**
- ✅ Feedback textarea expands for input
- ✅ Score input accepts 0-100 range
- ✅ After submission, interview status changes to "InterviewCompleted"
- ✅ Score displayed prominently (85)
- ✅ Green banner appears: "High Score - Eligible for Face-to-Face Meeting"
- ✅ "Schedule Meeting" button appears
- ✅ If candidate already onboarded: Gray banner, no button

**Validation Tests:**
- Try submitting without feedback → Error: "Please provide feedback"
- Try score > 100 → Validation prevents entry
- Try score < 0 → Validation prevents entry

**Business Rule Verified:**
- ✅ Only interviews with score >= 80 show "Schedule Meeting" button
- ✅ Interviews with score < 80 do not show the button

---

### Step 7: Schedule Face-to-Face Meeting

**Navigation:** Click "Schedule Meeting" button from completed interview

**Test Data:**
```
Candidate: Alex Martinez [Pre-filled]
Project: Digital Wallet Platform (ACTIVE) [Pre-filled]
Shortlist Decision ID: [Auto-created, field hidden when coming from interview]
Location: Building A, 5th Floor, Conference Room 502
Scheduled Date & Time: [Select next weekday at 2:00 PM]
Agenda: Final round discussion covering:
- Technical architecture deep dive
- Team fit and collaboration style
- Project expectations and deliverables
- Compensation and benefits discussion
- Start date and onboarding timeline
```

**Expected Results:**
- ✅ Candidate and project pre-filled
- ✅ Shortlist decision auto-created (field hidden)
- ✅ Only shortlisted candidates shown in dropdown
- ✅ Only ACTIVE/PLANNING projects shown
- ✅ Blue info box explains meeting requirements
- ✅ Meeting appears in Meetings list with status "MeetingScheduled"

**Validation Tests:**
- Try past date → Error: "Meeting cannot be scheduled in the past"
- Try weekend date → Error: "Face-to-face meetings should be scheduled on weekdays"
- Try time outside 9 AM - 6 PM → Error: "Please schedule during business hours"
- Try location < 5 characters → Error: "Please provide a more detailed location"
- Try agenda < 20 characters → Error: "Please provide a more detailed agenda"

---

### Step 8: Complete Meeting

**Navigation:** Meetings list → Click "Complete Meeting" on Alex Martinez's meeting

**Test Data:**
```
Agreement Reached: ✓ (checked)
Meeting Outcome: Excellent meeting with Alex. Both parties agreed on project scope, compensation package, and start date. Alex is excited about the technology stack and team culture. Mutual agreement reached to proceed with onboarding. Start date confirmed as [2 weeks from today].
```

**Expected Results:**
- ✅ Checkbox for "Agreement reached"
- ✅ Outcome textarea with character guidance
- ✅ After submission, meeting status changes to "MeetingCompleted"
- ✅ Green success banner appears: "✓ Meeting successful! Candidate can now proceed to onboarding."
- ✅ "Initiate Onboarding" button appears
- ✅ If candidate already onboarded: Gray banner, no button

**Validation Tests:**
- Try submitting without outcome → Error: "Meeting outcome is required"
- Agreement checkbox can be unchecked (no onboarding button will appear)

**Business Rule Verified:**
- ✅ Only meetings with agreementReached = true show "Initiate Onboarding" button

---

### Step 9: Initiate Onboarding

**Navigation:** Click "Initiate Onboarding" button from completed meeting

**Test Data:**
```
Candidate: Alex Martinez [Pre-filled]
Project: Digital Wallet Platform (ACTIVE) [Pre-filled]
Face-to-Face Meeting: [Pre-filled with meeting date]
Training Program Name: Full Stack Developer Onboarding Program
Expected Completion Date: [Select date 3 months from today]
```

**Expected Results:**
- ✅ Candidate, project, and meeting pre-filled
- ✅ Only candidates with status "CandidateShortlisted" or "CandidateHired" shown
- ✅ Only ACTIVE/PLANNING projects shown
- ✅ Only completed meetings with agreement shown
- ✅ Blue info box explains prerequisites
- ✅ Onboarding appears in Onboarding list with status "OnboardingInitiated"
- ✅ Progress shows 0%

**Validation Tests:**
- Try submitting without training program name → Error: "Training program name is required"
- Try past completion date → Validation prevents selection
- Try meeting without agreement → Error: "Cannot initiate onboarding: Agreement not reached"

**Business Rule Verified:**
- ✅ Onboarding can only be initiated after successful face-to-face meeting with agreement

---

### Step 10: Update Onboarding Progress

**Navigation:** Onboarding list → Click "Update Progress" on Alex Martinez's onboarding

**Test Data:**
```
Progress: 25
Status: OnboardingInProgress
```

**Expected Results:**
- ✅ Progress slider or input (0-100)
- ✅ Status dropdown with three options
- ✅ After update, progress bar shows 25%
- ✅ Status badge updates to "InProgress"
- ✅ Can update multiple times until completion

**Validation Tests:**
- Try progress > 100 → Validation prevents entry
- Try progress < 0 → Validation prevents entry

---

## Validation Testing

### Form-Level Validations

Test each form with invalid data to verify error handling:

#### Project Form
- [ ] Empty project name
- [ ] Project name < 3 characters
- [ ] Duplicate project name
- [ ] No technologies added
- [ ] Duplicate technology
- [ ] Past start date for planning project
- [ ] Commitments < 10 characters

#### Candidate Form
- [ ] Empty name
- [ ] Name < 2 characters
- [ ] Invalid email format
- [ ] Duplicate email
- [ ] Invalid phone format
- [ ] Phone < 10 digits
- [ ] No skills added
- [ ] Duplicate skill
- [ ] Invalid resume URL
- [ ] Resume summary < 20 characters

#### Staffing Request Form
- [ ] No project selected
- [ ] Positions < 1
- [ ] Positions > 50
- [ ] No skills added
- [ ] No mandatory skills
- [ ] Duplicate skill

#### Interview Schedule Form
- [ ] No candidate selected
- [ ] No staffing request selected
- [ ] Past date/time
- [ ] Time outside business hours (before 9 AM or after 6 PM)
- [ ] Duration < 15 minutes
- [ ] Duration > 240 minutes
- [ ] No panel members
- [ ] Duplicate panel member

#### Meeting Schedule Form
- [ ] No candidate selected
- [ ] No project selected
- [ ] Past date/time
- [ ] Weekend date
- [ ] Time outside business hours
- [ ] Location < 5 characters
- [ ] Agenda < 20 characters

#### Onboarding Initiate Form
- [ ] No candidate selected
- [ ] No project selected
- [ ] No meeting selected
- [ ] Meeting without agreement
- [ ] Empty training program name
- [ ] Past completion date

---

## Business Rules Testing

### Rule 1: Candidate Matching
**Test:** Create staffing request with mandatory skills

**Verify:**
- [ ] Only candidates with ALL mandatory skills appear in matches
- [ ] Candidates without mandatory skills are filtered out
- [ ] Match score is 0-100
- [ ] Candidates with score > 70 show "Auto-Considered" badge
- [ ] Internal candidates show "Internal" badge

### Rule 2: Interview Score Threshold
**Test:** Complete interviews with different scores

**Verify:**
- [ ] Score 85 → "Schedule Meeting" button appears
- [ ] Score 80 → "Schedule Meeting" button appears (boundary)
- [ ] Score 79 → No "Schedule Meeting" button
- [ ] Score 50 → No "Schedule Meeting" button

### Rule 3: Meeting Agreement Requirement
**Test:** Complete meetings with and without agreement

**Verify:**
- [ ] Agreement checked → "Initiate Onboarding" button appears
- [ ] Agreement unchecked → No "Initiate Onboarding" button

### Rule 4: Duplicate Workflow Prevention
**Test:** Try to re-interview/re-meet/re-onboard a candidate

**Setup:**
1. Complete full workflow for a candidate (through onboarding)
2. Try to schedule new interview for same candidate

**Verify:**
- [ ] In staffing request matches: Candidate shows "Already Onboarded" badge
- [ ] "Schedule Interview" button is hidden
- [ ] Gray styling indicates unavailable action
- [ ] In interview list: High-scoring interview shows gray banner
- [ ] "Schedule Meeting" button is hidden for onboarded candidate
- [ ] In meeting list: Completed meeting shows gray banner
- [ ] "Initiate Onboarding" button is hidden for onboarded candidate

### Rule 5: Status-Based Filtering
**Test:** Verify dropdowns show only valid records

**Verify:**
- [ ] Project dropdowns: Only ACTIVE/PLANNING projects
- [ ] Candidate dropdowns: Rejected candidates filtered out
- [ ] Staffing request dropdowns: Only OPEN/IN_PROGRESS requests
- [ ] Meeting candidate dropdown: Only shortlisted candidates

### Rule 6: Business Hours Enforcement
**Test:** Try scheduling outside business hours

**Verify:**
- [ ] Interview before 9 AM → Error
- [ ] Interview after 6 PM → Error
- [ ] Meeting before 9 AM → Error
- [ ] Meeting after 6 PM → Error
- [ ] Meeting on Saturday → Error
- [ ] Meeting on Sunday → Error

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Failed to load data" or API errors

**Solution:**
1. Verify backend is running: `curl http://localhost:8080/api/health`
2. Check backend logs for errors
3. Verify database connection
4. Check browser console for CORS errors

#### Issue: Form validation not working

**Solution:**
1. Check browser console for JavaScript errors
2. Verify all required fields are filled
3. Clear browser cache and reload
4. Check field-specific error messages

#### Issue: Candidate not appearing in matches

**Solution:**
1. Verify candidate has ALL mandatory skills from staffing request
2. Check skill proficiency levels match or exceed requirements
3. Verify candidate status is not "CandidateRejected"
4. Check match score is > 0

#### Issue: "Schedule Meeting" button not appearing

**Solution:**
1. Verify interview score is >= 80
2. Check interview status is "InterviewCompleted"
3. Verify candidate doesn't have active onboarding
4. Refresh the page to reload data

#### Issue: Cannot initiate onboarding

**Solution:**
1. Verify meeting has "agreementReached" = true
2. Check meeting status is "MeetingCompleted"
3. Verify candidate is not already in onboarding
4. Ensure all required fields are filled

#### Issue: Dropdown shows "Unknown" values

**Solution:**
1. Ensure related data is loaded (projects, candidates, etc.)
2. Check browser console for API errors
3. Verify foreign key relationships in database
4. Refresh the page to reload all data

---

## Test Checklist

Use this checklist to track your testing progress:

### Core Workflow
- [ ] Create Project
- [ ] Create Candidate
- [ ] Create Staffing Request
- [ ] Match Candidates
- [ ] Schedule Interview
- [ ] Complete Interview (score >= 80)
- [ ] Schedule Face-to-Face Meeting
- [ ] Complete Meeting (with agreement)
- [ ] Initiate Onboarding
- [ ] Update Onboarding Progress

### Validation Testing
- [ ] All form validations tested
- [ ] Error messages display correctly
- [ ] Field-level errors clear on input
- [ ] Form-level errors show at top
- [ ] Required field indicators work

### Business Rules
- [ ] Candidate matching with mandatory skills
- [ ] Interview score threshold (80)
- [ ] Meeting agreement requirement
- [ ] Duplicate workflow prevention
- [ ] Status-based filtering
- [ ] Business hours enforcement

### UI/UX
- [ ] Navigation works correctly
- [ ] Responsive design on different screen sizes
- [ ] Loading states display
- [ ] Success messages appear
- [ ] Error messages are clear
- [ ] Badges and colors are correct
- [ ] Character counters work
- [ ] Date pickers prevent invalid dates

### Edge Cases
- [ ] Try to onboard same candidate twice
- [ ] Complete interview with score < 80
- [ ] Complete meeting without agreement
- [ ] Schedule interview in the past
- [ ] Schedule meeting on weekend
- [ ] Add duplicate skills/technologies
- [ ] Submit forms with missing data

---

## Test Data Sets

### Additional Test Candidates

**Candidate 2: Senior Backend Developer**
```
Name: Maria Rodriguez
Email: maria.rodriguez@example.com
Phone: +1 (555) 234-5678
Source: INTERNAL
Skills: Java (EXPERT, 8y, Mandatory), Spring Boot (ADVANCED, 6y, Mandatory), PostgreSQL (ADVANCED, 7y)
Resume Summary: Senior backend developer with 8+ years of experience in Java and Spring Boot. Expert in microservices architecture, API design, and database optimization.
```

**Candidate 3: Junior Frontend Developer**
```
Name: David Kim
Email: david.kim@example.com
Phone: +1 (555) 345-6789
Source: EXTERNAL
Skills: React (INTERMEDIATE, 2y, Mandatory), JavaScript (INTERMEDIATE, 2y), CSS (INTERMEDIATE, 2y)
Resume Summary: Junior frontend developer with 2 years of experience in React and modern JavaScript. Passionate about UI/UX and responsive design.
```

### Additional Test Projects

**Project 2: E-Commerce Platform**
```
Name: E-Commerce Platform Modernization
Technologies: React, Node.js, MongoDB, Redis, AWS
Status: PLANNING
Manager: John Smith
Commitments: Modernize legacy e-commerce platform with microservices architecture, implement real-time inventory management, and enhance customer experience.
```

**Project 3: Mobile Banking App**
```
Name: Mobile Banking Application
Technologies: React Native, TypeScript, Node.js, PostgreSQL, Firebase
Status: ACTIVE
Manager: Emily Chen
Commitments: Develop secure mobile banking application with biometric authentication, real-time notifications, and seamless transaction processing.
```

---

## Performance Testing

### Load Testing Scenarios

1. **Create Multiple Records**
   - Create 10 projects
   - Create 20 candidates
   - Create 15 staffing requests
   - Verify UI remains responsive

2. **Concurrent Operations**
   - Open multiple browser tabs
   - Perform different operations simultaneously
   - Verify data consistency

3. **Large Data Sets**
   - Add candidate with 20+ skills
   - Add project with 15+ technologies
   - Verify form performance

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all form fields
- [ ] Submit forms using Enter key
- [ ] Navigate menu using keyboard
- [ ] Close modals with Escape key

### Screen Reader Compatibility
- [ ] Form labels are properly associated
- [ ] Error messages are announced
- [ ] Required fields are indicated
- [ ] Button purposes are clear

---

## Browser Compatibility

Test the application in multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Mobile Responsiveness

Test on different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Conclusion

This testing guide covers the complete candidate onboarding workflow from project creation to onboarding completion. Follow each step carefully and verify all expected results and validations.

For any issues or questions, refer to the Troubleshooting section or check the application logs.

**Happy Testing! 🚀**