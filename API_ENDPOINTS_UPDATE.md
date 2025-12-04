# CivicReporter API - New Response Endpoint

## Admin Response System (NEW)

### Add Admin Response to Issue

**Endpoint:** `PATCH /api/admin/issues/:id/response`

**Authentication:** Required (JWT token in `x-auth-token` header)

**Authorization:** Admin only

**Request Body:**
```json
{
  "adminResponse": "We have received your report and will investigate this issue within 48 hours. A team has been assigned to your location."
}
```

**Response (200 OK):**
```json
{
  "_id": "issue_id",
  "user": {
    "_id": "user_id",
    "name": "John Citizen",
    "email": "john@example.com"
  },
  "title": "Broken Streetlight",
  "category": "Public Safety",
  "description": "The streetlight near Main Street is not working",
  "address": "123 Main Street, City",
  "status": "In Progress",
  "imageUrl": "https://cloudinary.com/...",
  "adminResponse": "We have received your report and will investigate this issue within 48 hours. A team has been assigned to your location.",
  "responseDate": "2024-01-15T10:30:00Z",
  "date": "2024-01-14T08:00:00Z"
}
```

**Error Responses:**

- **400 Bad Request:** 
  - Empty or missing adminResponse field
  - Invalid issue ID

- **401 Unauthorized:** 
  - No JWT token provided
  - Invalid JWT token

- **403 Forbidden:** 
  - User is not an admin

- **404 Not Found:** 
  - Issue not found

## Updated Issue Schema

The Issue model now includes:
- `adminResponse` (String, default: null) - The admin's response to the citizen's report
- `responseDate` (Date, default: null) - Timestamp when admin responded

## Complete Admin Endpoints

### GET /api/admin/issues
Get all issues with optional filtering

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status (Reported, In Progress, Resolved)

### GET /api/admin/stats
Get statistics about issues

### GET /api/admin/category/:category
Get issues by specific category

### PATCH /api/admin/issues/:id/status
Update issue status

**Request Body:**
```json
{
  "status": "In Progress"
}
```

### PATCH /api/admin/issues/:id/response
Add admin response to issue (NEW)

### DELETE /api/admin/issues/:id
Delete an issue

## Frontend Components

### Admin Dashboard
- **Route:** `/admin` (Protected with adminGuard)
- **Component:** AdminDashboardComponent
- **Features:**
  - View all reported issues
  - Filter by category and status
  - Update issue status
  - Add/edit responses to citizen reports
  - Delete issues
  - View statistics (Total, Pending, In Progress, Resolved)
  - Response modal dialog for entering admin replies

### Citizen Dashboard (Updated)
- **Route:** `/dashboard` (Protected with authGuard)
- **Features:**
  - Citizens now see admin responses on their issue cards
  - Display response date and time
  - Visual indicator when admin has responded (blue response box)

## Usage Example

1. **Citizen submits issue:**
   - POST /api/issues/create with issue details

2. **Admin views all issues:**
   - GET /api/admin/issues

3. **Admin responds to citizen's report:**
   - PATCH /api/admin/issues/:id/response with response text

4. **Citizen sees admin response:**
   - GET /api/issues or view dashboard
   - Response displays in issue card with timestamp

## Testing the New Endpoint

Using curl:
```bash
curl -X PATCH http://localhost:5000/api/admin/issues/issue_id/response \
  -H "x-auth-token: jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"adminResponse": "We will handle this immediately"}'
```

Using Postman:
1. Set method to PATCH
2. URL: `http://localhost:5000/api/admin/issues/{issue_id}/response`
3. Headers: Add `x-auth-token` with your JWT token
4. Body (raw JSON):
```json
{
  "adminResponse": "We will handle this immediately"
}
```
