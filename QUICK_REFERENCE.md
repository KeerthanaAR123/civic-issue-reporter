# CivicReporter - Quick Reference Guide

A one-page visual reference for the complete project.

## 🎯 PROJECT OVERVIEW

```
CivicReporter: Community Issue Reporting & Tracking Platform
├─ Citizens: Report issues, track status
└─ Admins: Manage all issues, update status, view analytics
```

---

## 📋 FEATURE MATRIX

### Citizen Features ✅
```
┌─ Authentication ─────────────────────────┐
│ ✓ Sign-up with JWT token                 │
│ ✓ Login with email/password              │
│ ✓ Secure password hashing                │
└──────────────────────────────────────────┘

┌─ Issue Reporting ────────────────────────┐
│ ✓ Title, Description, Category           │
│ ✓ Address with interactive map           │
│ ✓ Image upload (Cloudinary)              │
│ ✓ Geolocation detection                  │
│ ✓ Draggable map marker                   │
└──────────────────────────────────────────┘

┌─ Issue Management ──────────────────────┐
│ ✓ View own issues                        │
│ ✓ Track real-time status                 │
│ ✓ Delete own issues                      │
│ ✓ See issue cards with images            │
└──────────────────────────────────────────┘
```

### Admin Features ✅
```
┌─ Dashboard ──────────────────────────────┐
│ ✓ View ALL issues from all users         │
│ ✓ Real-time statistics                   │
│ ✓ Total/Pending/In Progress/Resolved     │
└──────────────────────────────────────────┘

┌─ Issue Management ──────────────────────┐
│ ✓ Update status via dropdown             │
│ ✓ Delete any issue                       │
│ ✓ Filter by category                     │
│ ✓ Filter by status                       │
│ ✓ Combined filtering                     │
└──────────────────────────────────────────┘

┌─ Reporting ─────────────────────────────┐
│ ✓ Category breakdown                     │
│ ✓ Status distribution                    │
│ ✓ Reporter information                   │
│ ✓ Issue history                          │
└──────────────────────────────────────────┘
```

---

## 🏗️ ARCHITECTURE

```
Client (Angular 18)                Server (Express.js)
├─ Components                       ├─ Routes
│  ├─ Auth (Login/Register)        │  ├─ /api/auth (JWT)
│  ├─ Dashboard (Dual view)        │  ├─ /api/issues (CRUD)
│  ├─ Report Issue (Map/Form)      │  └─ /api/admin (Admin)
│  └─ Navbar                       │
├─ Services                        ├─ Models
│  ├─ Auth Service                │  ├─ User
│  ├─ Issue Service               │  └─ Issue
│  └─ Admin Service               │
├─ Guards                         ├─ Middleware
│  ├─ Auth Guard                  │  ├─ JWT Verify
│  └─ Admin Guard                 │  └─ Admin Check
└─ Routes                         │
   └─ Protected Routes            ├─ External Services
                                  │  └─ Cloudinary
                                  │
                                  Database (MongoDB)
```

---

## 📡 API ENDPOINTS

### Auth Endpoints
```
POST   /api/auth/register           Create account
POST   /api/auth/login              Login with JWT
```

### Issue Endpoints (Protected)
```
GET    /api/issues                  Get issues (user/admin)
GET    /api/issues/:id              Get single issue
POST   /api/issues                  Create issue
PUT    /api/issues/:id/status       Update status
DELETE /api/issues/:id              Delete issue
```

### Admin Endpoints (Admin Only)
```
GET    /api/admin/issues            Get all issues (filtered)
GET    /api/admin/stats             Get statistics
GET    /api/admin/category/:cat     Get by category
PATCH  /api/admin/issues/:id        Update status
DELETE /api/admin/issues/:id        Delete any issue
```

---

## 🚀 QUICK START

### Setup (5 minutes)
```bash
# Backend
cd server && npm install && npm run dev

# Frontend  
cd client && npm install && ng serve
```

### Test Accounts
```
Citizen:  user@test.com / password123
Admin:    admin@test.com / password123
```

### Access
```
Frontend: http://localhost:4200
Backend:  http://localhost:5000
```

---

## 📂 KEY FILES

### Backend
| File | Purpose |
|------|---------|
| `server/routes/auth.js` | Authentication |
| `server/routes/issues.js` | Issue CRUD |
| `server/routes/adminRoutes.js` | Admin features |
| `server/config/cloudinary.js` | Image upload |

### Frontend
| File | Purpose |
|------|---------|
| `auth.service.ts` | Auth API |
| `issue.service.ts` | Issue API |
| `admin.service.ts` | Admin API |
| `dashboard.component.ts` | Dual view |
| `report-issue.component.ts` | Issue creation |

---

## 🔄 USER FLOWS

### Citizen Flow
```
Register (email, password, name)
  ↓
Login (get JWT token)
  ↓
Report Issue (title, description, category, image)
  ↓
View Dashboard (see own issues)
  ↓
Track Status (watch admin update)
  ↓
Delete Issue (if needed)
  ↓
Logout
```

### Admin Flow
```
Register (email with "admin")
  ↓
Login (get JWT token + admin role)
  ↓
View Admin Dashboard (all issues)
  ↓
Filter by Category or Status
  ↓
Update Issue Status
  ↓
View Statistics
  ↓
Delete Issues
  ↓
Logout
```

---

## 💾 DATA MODEL

### User
```json
{
  "id": "mongodb_id",
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashed_password",
  "role": "citizen|admin"
}
```

### Issue
```json
{
  "id": "mongodb_id",
  "user": "user_id",
  "title": "Issue Title",
  "category": "Road Infrastructure",
  "description": "Details...",
  "address": "123 Main St",
  "status": "Reported|In Progress|Resolved",
  "imageUrl": "cloudinary_url",
  "date": "2024-01-15T10:00:00Z"
}
```

---

## 🔐 SECURITY

| Feature | Implementation |
|---------|-----------------|
| Auth | JWT tokens (1 hour) |
| Password | bcryptjs hashing |
| Authorization | Role-based (citizen/admin) |
| Ownership | User ID verification |
| Input | Zod validation |
| CORS | Configured for localhost |

---

## 🎨 UI COMPONENTS

### Common
- **Navbar** - Navigation & logout
- **Auth Forms** - Login/Register with validation
- **Error Messages** - User-friendly feedback

### Citizen
- **Dashboard** - Card grid view of issues
- **Report Form** - Issue creation with map
- **Map** - Leaflet interactive map

### Admin
- **Dashboard** - Table view of all issues
- **Stats Cards** - Real-time metrics
- **Filters** - Category & status dropdowns

---

## 📊 STATUS FLOW

```
Reported (Yellow)
   ↓
In Progress (Blue)
   ↓
Resolved (Green)
```

Each status is a distinct stage. Admins can update at any time.

---

## 🛠️ TECH STACK

```
Frontend              Backend           Database      Storage
├─ Angular 18         ├─ Express.js     ├─ MongoDB    └─ Cloudinary
├─ TypeScript         ├─ Node.js        └─ Mongoose
├─ Tailwind CSS       ├─ JWT
├─ Reactive Forms     ├─ bcryptjs
├─ Leaflet.js         ├─ Multer
└─ Animations         ├─ Zod
                      └─ Mongoose
```

---

## 📚 DOCUMENTATION FILES

| File | Content |
|------|---------|
| `README.md` | Complete project docs |
| `QUICKSTART.md` | 5-minute setup |
| `API_DOCUMENTATION.md` | API reference |
| `TESTING_CHECKLIST.md` | Test cases |
| `TROUBLESHOOTING.md` | Common fixes |
| `IMPLEMENTATION_SUMMARY.md` | Technical details |
| `FILES_OVERVIEW.md` | File inventory |

---

## ✅ VERIFICATION

Before deployment, verify:
```
✓ Backend starts without errors
✓ Frontend compiles successfully
✓ Can register & login
✓ Can create issue with image
✓ Can see issue in dashboard
✓ Admin can update status
✓ Can delete issues
✓ Filters work correctly
✓ Map loads and works
✓ No console errors
✓ No network errors
```

---

## 🎯 READY FOR

- ✅ Production deployment
- ✅ Team development
- ✅ Client presentation
- ✅ Further enhancements
- ✅ Scaling

---

## 📞 SUPPORT

**Getting Started?** → Read `QUICKSTART.md`

**Need API Details?** → Check `API_DOCUMENTATION.md`

**Found a Bug?** → See `TROUBLESHOOTING.md`

**Want to Test?** → Use `TESTING_CHECKLIST.md`

---

## 🎊 STATUS: COMPLETE ✅

All features implemented, documented, and tested.

Ready to deploy or enhance!

---

*Last Updated: December 2024*
*Status: Production Ready*
