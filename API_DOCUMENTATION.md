# CivicReporter - API Documentation

Complete API reference for CivicReporter backend.

## Base URL
```
http://localhost:5000
```

## Authentication

All protected endpoints require the `x-auth-token` header:
```
x-auth-token: <JWT_TOKEN>
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen"
  }
}
```

**Errors:**
- `400`: User already exists
- `400`: Missing required fields
- `500`: Server error

**Notes:**
- If email contains "admin", role will be "admin"
- Otherwise role will be "citizen"
- Password is hashed before storing

---

### Login User

**POST** `/api/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Errors:**
- `400`: Invalid credentials
- `500`: Server error

**Notes:**
- Token valid for 1 hour
- Store token in localStorage
- Use token in `x-auth-token` header for future requests

---

## 📋 Issue Endpoints

### Get All Issues

**GET** `/api/issues`

Get all issues (citizens see their own, admins see all).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status

**Example:**
```
GET /api/issues?category=Public%20Safety&status=Reported
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "title": "Broken Streetlight",
    "category": "Public Safety",
    "description": "Light is not working",
    "address": "123 Main St, City, State",
    "status": "Reported",
    "imageUrl": "https://res.cloudinary.com/...",
    "date": "2024-01-15T10:30:00Z"
  }
]
```

**Errors:**
- `401`: No token or invalid token
- `500`: Server error

---

### Get Single Issue

**GET** `/api/issues/:id`

Get details of a specific issue.

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Parameters:**
- `id` (required): Issue ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe"
  },
  "title": "Broken Streetlight",
  "category": "Public Safety",
  "description": "Light is not working",
  "address": "123 Main St",
  "status": "Reported",
  "imageUrl": "https://res.cloudinary.com/...",
  "date": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Issue not found
- `500`: Server error

---

### Create Issue

**POST** `/api/issues`

Create a new issue report.

**Headers:**
```
x-auth-token: <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: "Broken Streetlight"
category: "Public Safety"
description: "The streetlight at corner is broken"
address: "123 Main Street, City, State"
image: <File> (optional)
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",
  "title": "Broken Streetlight",
  "category": "Public Safety",
  "description": "The streetlight at corner is broken",
  "address": "123 Main Street, City, State",
  "status": "Reported",
  "imageUrl": "https://res.cloudinary.com/...",
  "date": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `400`: Validation error (check required fields)
- `401`: No token
- `500`: Image upload failed or server error

**Notes:**
- Status automatically set to "Reported"
- Image optional, uploaded to Cloudinary
- User ID automatically assigned from token

---

### Update Issue Status

**PUT** `/api/issues/:id/status`

Update the status of an issue (Admin only).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Parameters:**
- `id` (required): Issue ID

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "In Progress",
  ...
}
```

**Errors:**
- `401`: No token
- `403`: User is not admin
- `404`: Issue not found
- `500`: Server error

**Allowed Status Values:**
- `Reported` (initial)
- `In Progress` (being handled)
- `Resolved` (completed)

---

### Delete Issue

**DELETE** `/api/issues/:id`

Delete an issue (citizens: own only, admins: any).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Parameters:**
- `id` (required): Issue ID

**Response (200):**
```json
{
  "msg": "Issue removed"
}
```

**Errors:**
- `401`: Not authorized (don't own the issue)
- `404`: Issue not found
- `500`: Server error

---

## 🛡️ Admin Endpoints

### Get All Issues (Admin)

**GET** `/api/admin/issues`

Get all issues with optional filtering (Admin only).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "title": "Broken Streetlight",
    "category": "Public Safety",
    "status": "Reported",
    ...
  }
]
```

**Errors:**
- `401`: No token
- `403`: Not admin
- `500`: Server error

---

### Get Admin Statistics

**GET** `/api/admin/stats`

Get system statistics (Admin only).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Response (200):**
```json
{
  "total": 45,
  "reported": 12,
  "inProgress": 18,
  "resolved": 15
}
```

**Errors:**
- `401`: No token
- `403`: Not admin
- `500`: Server error

---

### Get Issues by Category

**GET** `/api/admin/category/:category`

Get all issues in a specific category (Admin only).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Parameters:**
- `category` (required): Category name

**Example:**
```
GET /api/admin/category/Road%20Infrastructure
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Pothole",
    "category": "Road Infrastructure",
    ...
  }
]
```

**Errors:**
- `401`: No token
- `403`: Not admin
- `500`: Server error

---

### Update Issue Status (Admin)

**PATCH** `/api/admin/issues/:id/status`

Update issue status (Admin only).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Parameters:**
- `id` (required): Issue ID

**Request Body:**
```json
{
  "status": "Resolved"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "Resolved",
  ...
}
```

**Errors:**
- `400`: Invalid status
- `401`: No token
- `403`: Not admin
- `404`: Issue not found

---

### Delete Issue (Admin)

**DELETE** `/api/admin/issues/:id`

Delete any issue (Admin only).

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Parameters:**
- `id` (required): Issue ID

**Response (200):**
```json
{
  "message": "Issue deleted successfully"
}
```

**Errors:**
- `401`: No token
- `403`: Not admin
- `404`: Issue not found
- `500`: Server error

---

## 📊 Valid Categories

- `Road Infrastructure`
- `Waste Management`
- `Public Safety`
- `Water Supply`
- `Other`

## 🔄 Status Flow

```
Reported
  ↓
In Progress
  ↓
Resolved
```

Users can jump to any status. No enforcement of flow order.

## 🔑 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Server Error |

## 📝 Example Workflow

### Citizen Workflow

```
1. POST /api/auth/register
   → Get token, store in localStorage

2. POST /api/issues
   → Create issue with image
   → Automatically assigned to user
   → Status = "Reported"

3. GET /api/issues
   → See own issues

4. DELETE /api/issues/:id
   → Delete own issue

5. Watch admin update status in real-time
```

### Admin Workflow

```
1. POST /api/auth/register (with "admin" in email)
   → Automatically get admin role

2. GET /api/admin/issues
   → See all issues

3. GET /api/admin/stats
   → Check statistics

4. GET /api/admin/category/Public%20Safety
   → Filter by category

5. PATCH /api/admin/issues/:id/status
   → Update issue status

6. DELETE /api/admin/issues/:id
   → Delete any issue
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

### Get Issues
```bash
curl -X GET http://localhost:5000/api/issues \
  -H "x-auth-token: YOUR_TOKEN_HERE"
```

### Create Issue
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "x-auth-token: YOUR_TOKEN_HERE" \
  -F "title=Pothole" \
  -F "category=Road Infrastructure" \
  -F "description=Large hole in road" \
  -F "address=123 Main St" \
  -F "image=@/path/to/image.jpg"
```

---

**API Documentation Complete! 🚀**
