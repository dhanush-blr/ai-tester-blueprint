# Test Plan - Restful Booker API

## Objective

The objective of this test plan is to verify the RESTful Booker API, where we have created booking, updated booking, delete booking with authentication, and add authentication token. It contains a lot of bugs. We need to find all those bugs. That's the overall objective. We are going to put them all into a Postman for test case execution. And in the end, we need automation for the same by using the REST assured framework.
URL - https://restful-booker.herokuapp.com/apidoc/index.html

## Scope

1. Functional Testing: Verify correctness of all API endpoints, booking creation, modification, cancellation, and auth validation.
2. Data Validation Testing: Input validation, boundary values, and accuracy of responses.
3. Error Handling Testing: Error codes, messaging, and graceful error handling.
4. Performance Testing: Response time under normal/peak loads and throughput.
5. Security Testing: SQL injection, XSS, HTTPS compliance, and access controls.
6. Integration Testing: Inter-endpoint interactions and data consistency.
7. Compatibility Testing: Multi-platform, browser, and device testing.
8. Regression Testing: Post-bug fix validation.

## Inclusions

* Create (POST) Operations
* Read (GET) Operations
* Update (PUT) Operations
* Delete (DELETE) Operations
* Boundary Testing & Concurrency Testing

## Test Environments

* QA / Pre Prod URL: https://restful-booker.herokuapp.com/apidoc/index.html
* Windows 10 (Chrome, Firefox, Edge), Mac OS (Safari), Android Mobile (Chrome), iPhone Mobile (Safari)

## Defect Reporting Procedure

* Tools: JIRA
* New Frontend POC: Devesh
* Backend POC: Sonal
* Dev Ops POC: Prajeeth

## Test Strategy

* Design Techniques: Equivalence Class Partition, Boundary Value Analysis, Decision Table Testing, State Transition Testing, Use Case Testing, Error Guessing, Exploratory Testing.
* Process: Smoke testing first (reject build if it fails), followed by in-depth concurrent execution across supported environments. Reports are sent daily via JIRA and EOD status email.
* Best Practices: Context Driven Testing, Shift Left Testing, Exploratory Testing, End to End Flow Testing.

## Test Schedule

* 2 Sprints to Test the Application
* Workflow: Creating Test Plan -> Test Case Creation -> Test Case Execution -> Summary Reports Submission

## Entry and Exit Criteria

* Requirement Analysis: Starts on receiving requirements; exits when explored and understood.
* Test Execution: Starts when test docs are signed off and application is ready; exits when reports and defects are ready.
* Test Closure: Starts when test case/defect reports are ready; exits on Test Summary Report delivery.

## Tools

* Snipping Screenshot Tool, Word and Excel documents

## Risks and Mitigations

* Resource Non-Availability: Backup Resource Planning
* Build URL down: Resources will work on other tasks
* Less time: Ramp up resources dynamically based on client needs

## Approvals

* Mandatory sign-offs required for: Test Plan, Test Scenarios, Test Cases, and Reports.
