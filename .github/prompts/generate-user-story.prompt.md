---
agent: agent
---

# User Story Generation Prompt

Use this prompt to generate well-structured user stories for any feature or requirement.

## Input Format

Provide the following information to generate a user story:

```
FEATURE DESCRIPTION:
[Describe the feature, requirement, or functionality in detail]

TARGET USER:
[Who is the primary user? e.g., end user, admin, developer]

CONTEXT:
[What problem does this solve? What is the background?]

CONSTRAINTS (if any):
[Technical limitations, business rules, compliance requirements]

RELATED FEATURES:
[List any features this relates to or depends on]
```

## Output Format

Generate a user story document using this template:

---

# User Story #XXX: [Story Title]

## Story
**As a** [user role]  
**I want** [goal/desire]  
**So that** [benefit/value]

## Acceptance Criteria
- Given [precondition/context]
- When [action/trigger]
- Then [expected outcome]
- And [additional outcomes if needed]

Include:
- Happy path scenarios
- Edge cases and error conditions
- Validation requirements
- Performance requirements if applicable

## Priority
[High/Medium/Low] - with justification

## Story Points
[1, 2, 3, 5, 8, 13, 21]

## Labels
- [feature/enhancement/bug]
- [domain-specific labels]
- [mvp] (if applicable)

## Dependencies
- #XXX [Related Story Title]
- None (if no dependencies)

## Technical Notes
- Implementation considerations
- Technical requirements
- API integrations needed
- Database schema considerations
- Security requirements
- Performance considerations
- Third-party services needed
- Implementation approach suggestions

## Related Stories
- #XXX [Related Story Title]
- #XXX [Related Story Title]

## Design Notes (Optional)
- UI/UX considerations
- Mockup links
- Design system references
- Accessibility requirements (WCAG 2.1 AA)

## Testing Notes (Optional)
- Specific test scenarios
- Edge cases to consider
- Unit test requirements
- Integration test requirements

## Questions/Risks (Optional)
- Open questions
- Known risks
- Items needing clarification

---
*Created: [Date]*
*Last Updated: [Date]*

---

## Guidelines for Writing Effective User Stories

### 1. Be Specific About the User
Don't just say "user" - specify the role:
- ❌ "As a user..."
- ✅ "As an account holder..."
- ✅ "As a financial advisor using the platform..."

### 2. Focus on Value/Benefit
The "So that" clause should explain the real value:
- ❌ "So that I can click a button"
- ✅ "So that I can avoid late payment fees and maintain a good credit score"

### 3. Make Acceptance Criteria Testable
- ❌ "The system should be fast"
- ✅ "The report should load within 2 seconds for datasets up to 10,000 transactions"

### 4. Include Edge Cases
Don't just describe the happy path:
- What happens when the user has no data?
- What if the API is unavailable?
- What if the user enters invalid data?
- What about timezone differences?

### 5. Consider Non-Functional Requirements
- Performance (response time, throughput)
- Security (authentication, authorization, encryption)
- Accessibility (WCAG compliance, keyboard navigation)
- Usability (mobile responsiveness, error messages)

### 6. Think About Dependencies
- What data does this feature need?
- What other features must exist first?
- What third-party services are required?

## Story Sizing Guidelines

### 1 Point (Extra Small)
- Simple text changes
- Minor UI tweaks
- Configuration changes

### 2 Points (Small)
- Simple CRUD operations
- Basic form validation
- Simple display components

### 3 Points (Small-Medium)
- Basic API integration
- Simple state management
- Basic filtering/sorting

### 5 Points (Medium)
- Complex form with validation
- Multiple API integrations
- Moderate business logic

### 8 Points (Large)
- Complex feature with multiple components
- Advanced data processing
- Third-party service integration

### 13 Points (Extra Large)
- Major feature requiring multiple components
- Complex algorithms or AI/ML
- Significant architectural changes

### 21 Points (Too Large - Should Split)
- If a story is 21 points, it should be broken down into smaller stories

## Quick Reference Checklist

Use this checklist when creating user stories:

- [ ] Story follows "As a [user], I want [goal], So that [benefit]" format
- [ ] Title is clear and descriptive
- [ ] User role is specific
- [ ] Benefit/value is clearly articulated
- [ ] Acceptance criteria are detailed and testable
- [ ] Happy path is covered
- [ ] Edge cases are addressed
- [ ] Error handling is specified
- [ ] Priority is assigned with justification
- [ ] Story points reflect complexity
- [ ] Appropriate labels are added
- [ ] Dependencies are identified
- [ ] Technical implementation notes are included
- [ ] Security considerations are addressed
- [ ] Performance requirements are specified
- [ ] Accessibility requirements are noted
- [ ] Related stories are cross-referenced

## Common Pitfalls to Avoid

1. **Too Vague**: "As a user, I want the app to work better"
2. **Too Technical**: "As a user, I want a React component with Redux state"
3. **No Value**: "As a user, I want a button" (why do you want it?)
4. **Too Large**: Stories should be completable in one sprint
5. **Missing Acceptance Criteria**: No way to verify when story is done
6. **Ignoring Edge Cases**: Only describing the happy path
7. **No Dependencies**: Not identifying what needs to exist first

## Example Usage

### Example 1: Basic Feature

```
FEATURE DESCRIPTION:
Users should be able to export their financial data to a CSV file for external analysis or backup purposes.

TARGET USER:
End user (account holder)

CONTEXT:
Users want to analyze their data in spreadsheet applications or create backups of their financial information for personal records.

CONSTRAINTS:
- Must comply with data export regulations
- Should complete within 30 seconds for up to 5 years of data
- File size should not exceed 50MB

RELATED FEATURES:
- #007 Expense Tracking and Categorization
- #009 Reports and Analytics
```

### Example 2: Complex Feature

```
FEATURE DESCRIPTION:
Implement a bill reminder system that notifies users about upcoming recurring bills, allows them to mark bills as paid, and tracks payment history.

TARGET USER:
End user (account holder)

CONTEXT:
Users often forget to pay bills on time, resulting in late fees. They need a system that proactively reminds them of upcoming due dates and helps track payment status.

CONSTRAINTS:
- Must support multiple notification channels (email, SMS, push)
- Should allow customization of reminder timing (1 day, 3 days, 1 week before)
- Must handle recurring bills with various frequencies (weekly, monthly, quarterly, annually)
- Should integrate with calendar applications

RELATED FEATURES:
- #007 Expense Tracking and Categorization
- #010 Alerts and Notifications
- #006 Dashboard Overview
```