
# Executive Test Plan

## 1. Objective & Scope

### Objective:

To verify the RESTful Booker API by identifying and fixing bugs related to booking creation, modification, cancellation, and authentication validation.

### Scope:

1. **Functional Testing**: Verify correctness of all API endpoints.
2. **Data Validation Testing**: Input validation, boundary values, and accuracy of responses.
3. **Error Handling Testing**: Error codes, messaging, and graceful error handling.
4. **Performance Testing**: Response time under normal/peak loads and throughput.
5. **Security Testing**: SQL injection, XSS, HTTPS compliance, and access controls.
6. **Integration Testing**: Inter-endpoint interactions and data consistency.
7. **Compatibility Testing**: Multi-platform, browser, and device testing.
8. **Regression Testing**: Post-bug fix validation.

## 2. Test Environment Matrix

| Environment   | URL                                                    |
| ------------- | ------------------------------------------------------ |
| QA / Pre Prod | https://restful-booker.herokuapp.com/apidoc/index.html |

### Devices & Browsers:

- Windows 10: Chrome, Firefox, Edge
- Mac OS: Safari
- Android Mobile: Chrome
- iPhone Mobile: Safari

## 3. Execution Strategy

### Design Techniques:

- Equivalence Class Partition
- Boundary Value Analysis
- Decision Table Testing
- State Transition Testing
- Use Case Testing
- Error Guessing
- Exploratory Testing

### Process:

1. **Smoke Testing**: Reject build if it fails.
2. **Concurrent Execution**: In-depth testing across supported environments.
3. **Reporting**: Daily reports via JIRA and EOD status email.

### Best Practices:

- Context Driven Testing
- Shift Left Testing
- Exploratory Testing
- End to End Flow Testing

## 4. Defect Governance

### Tools:

- JIRA

### POCs:

- New Frontend: Devesh
- Backend: Sonal
- Dev Ops: Prajeeth

## 5. STLC Criteria

### Entry and Exit Criteria:

1. **Requirement Analysis**: Starts on receiving requirements; exits when explored and understood.
2. **Test Execution**: Starts when test docs are signed off and application is ready; exits when reports and defects are ready.
3. **Test Closure**: Starts when test case/defect reports are ready; exits on Test Summary Report delivery.

### Tools:

- Snipping Screenshot Tool
- Word and Excel documents

## 6. Risks and Mitigations

| Risk                      | Mitigation                                          |
| ------------------------- | --------------------------------------------------- |
| Resource Non-Availability | Backup Resource Planning                            |
| Build URL Down            | Resources will work on other tasks                  |
| Less Time                 | Ramp up resources dynamically based on client needs |

## 7. Approvals

- Mandatory sign-offs required for: Test Plan, Test Scenarios, Test Cases, and Reports.

# References

- [RESTful Booker API Documentation](https://restful-booker.herokuapp.com/apidoc/index.html)
