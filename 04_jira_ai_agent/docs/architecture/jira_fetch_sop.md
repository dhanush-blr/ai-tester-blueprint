# SOP - Jira Fetching & Normalization

This SOP documents the protocol for retrieving and normalizing ticket details from Jira Cloud REST API.

## 1. Credentials & Authentication
- **Authentication Method**: Basic Auth.
- **Header**: `Authorization: Basic <base64(email:API_token)>`
- **Accept**: `application/json`

## 2. API Endpoint
- **URL**: `${JIRA_URL}/rest/api/3/issue/${ISSUE_ID}`
- **Method**: `GET`

## 3. Atlassian Document Format (ADF) Flattening
Jira REST API v3 returns issue descriptions in the JSON-based Atlassian Document Format. The description must be parsed recursively:
- Text nodes (`type: "text"`) should have their `.text` value extracted.
- Block nodes (such as `paragraph`, `heading`, `listItem`) should append a newline `\n` to maintain paragraph structure.
- Array lists of child nodes must be traversed recursively.

## 4. Normalization Output Shape
The Express backend proxy must map the raw response fields to the following flat JSON object:
- `key`: The issue key (e.g., `VWO-48`).
- `summary`: Short summary/title of the issue.
- `description`: The recursively flattened plain text representation of the description.
- `issueType`: The ticket type name (e.g., `Story`, `Bug`, `Task`).
- `status`: The current issue workflow status.
- `priority`: Priority name.
- `components`: Array of mapped component names.
- `labels`: Array of raw strings.
- `fixVersions`: Array of mapped version names.
- `reporter`: Reporter's display name.
- `assignee`: Assignee's display name (defaulting to "Unassigned" if empty).

## 5. Error Boundaries
- **HTTP 401 Unauthorized**: Report authentication failures clearly. Do not swallow auth exceptions.
- **HTTP 404 Not Found**: Handle situations where the issue ID does not exist.
- **CORS Mitigation**: Express server acts as a proxy to prevent browser-side CORS preflight failures.
