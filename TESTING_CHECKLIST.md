# CivicReporter - Testing Checklist

Use this checklist to verify all features are working correctly.

## Pre-Testing Setup

- [ ] MongoDB is running
- [ ] Backend started: `npm run dev` in `/server`
- [ ] Frontend started: `ng serve` in `/client`
- [ ] Open browser to `http://localhost:4200`
- [ ] Open DevTools (F12) to check for errors

## 👤 Citizen Features Testing

### Authentication

- [ ] **Register as Citizen**
  - Go to `/register`
  - Enter name: "John Citizen"
  - Enter email: "citizen@test.com" (NO "admin" in email)
  - Enter password: "password123"
  - Click "Sign Up"
  - Should redirect to dashboard
  - Check localStorage for token: F12 → Application → localStorage → user_token

- [ ] **Login as Citizen**
  - Logout current user
  - Go to `/login`
  - Enter email: "citizen@test.com"
  - Enter password: "password123"
  - Click "Sign In"
  - Should redirect to dashboard
  - Should see "Welcome, John Citizen!"

- [ ] **Auth Guard Protection**
  - Logout
  - Try to access `/dashboard` directly
  - Should redirect to `/login`
  - Try to access `/report-issue` directly
  - Should redirect to `/login`

### Issue Reporting

- [ ] **Report New Issue**
  - Login as citizen
  - Click "+ Report New Issue"
  - Fill Title: "Broken Streetlight"
  - Select Category: "Public Safety"
  - Fill Description: "The light is not working at night"
  - Enter Location Address: "123 Main Street"
  - (Optional) Upload image
  - Click "Submit Report"
  - Should see success message
  - Should redirect to dashboard

- [ ] **Map Functionality**
  - Go to report issue page
  - Map should load and show India view
  - Click "Use My Current Location"
  - Marker should appear and address should auto-fill
  - Marker should be draggable
  - Dragging marker should update address

- [ ] **Image Upload**
  - Go to report issue page
  - Click file input
  - Select any image file
  - Should show file name below input
  - Submit the form
  - Image should be uploaded to Cloudinary
  - Image should display in dashboard

### Issue Management

- [ ] **View Own Issues**
  - Login as citizen
  - Go to dashboard
  - Should see card view of issues (not table)
  - Each card should show:
    - Issue title
    - Description snippet
    - Category badge
    - Location with icon
    - Status with color
    - Delete button

- [ ] **Delete Own Issue**
  - Click "Delete" on an issue card
  - Confirm in dialog
  - Issue should disappear from list
  - Should see success message

- [ ] **Cannot Delete Other's Issue**
  - Create second citizen account
  - Login as first citizen
  - Try to delete second citizen's issue (if visible - shouldn't be)
  - Should get permission error

### Status Tracking

- [ ] **See Real-time Status**
  - Login as citizen
  - Create issue (status should be "Reported")
  - Status badge should be yellow
  - Have admin update status to "In Progress"
  - Status should update to blue without page refresh
  - Have admin update to "Resolved"
  - Status should update to green

## 🛡️ Admin Features Testing

### Admin Access

- [ ] **Register as Admin**
  - Go to `/register`
  - Enter name: "Admin User"
  - Enter email: "admin@test.com" (MUST have "admin")
  - Enter password: "password123"
  - Click "Sign Up"
  - Should redirect to dashboard
  - Dashboard should show "Admin Dashboard"

- [ ] **Admin vs Citizen Dashboard**
  - Login as admin
  - Should see:
    - Statistics cards (Total, Pending, In Progress, Resolved)
    - Table view (not cards)
    - Filter dropdowns
    - Reporter name column
  - Logout, login as citizen
  - Should see:
    - Card grid view
    - Search bar
    - "Report New Issue" button
    - NO table or filters

### Dashboard Statistics

- [ ] **Statistics Accuracy**
  - Login as admin
  - Check total count matches number of issues in table
  - Check "Pending" = count of "Reported" status
  - Check "In Progress" = count of "In Progress" status
  - Check "Resolved" = count of "Resolved" status

- [ ] **Stats Update in Real-time**
  - Create new issue as citizen
  - Go back to admin dashboard
  - Stats should immediately increase

### Issue Management (Admin)

- [ ] **View All Issues**
  - Login as admin
  - Should see table with all issues (from all users)
  - Each row should show:
    - Title
    - Reporter name
    - Category
    - Status (with dropdown)
    - Delete button

- [ ] **Update Issue Status**
  - In admin table, click status dropdown
  - Select "In Progress"
  - Status should update in table
  - Open as citizen - status should reflect change
  - Update back to "Reported" and to "Resolved"
  - Verify changes persist

- [ ] **Delete Any Issue**
  - In admin table, click delete button
  - Confirm dialog
  - Issue should disappear
  - Check as citizen - issue should be gone

### Filtering

- [ ] **Filter by Category**
  - Go to admin dashboard
  - Have multiple issues with different categories
  - Select category filter: "Road Infrastructure"
  - Table should show only that category
  - Select another category
  - Table updates immediately
  - Select "All Categories"
  - All issues should show again

- [ ] **Filter by Status**
  - Go to admin dashboard
  - Select status filter: "Reported"
  - Table should show only "Reported" issues
  - Select "In Progress"
  - Table updates
  - Select "Resolved"
  - Table updates
  - Select "All Statuses"
  - All issues show

- [ ] **Combined Filters**
  - Select Category: "Public Safety"
  - Select Status: "In Progress"
  - Table should show only Public Safety issues with In Progress status

## 🔐 Security Testing

- [ ] **JWT Validation**
  - Open DevTools → Network tab
  - Make any API call
  - Check `x-auth-token` header is sent
  - Token should be present in localStorage

- [ ] **Protected Routes**
  - Logout
  - Manually go to `/dashboard` in address bar
  - Should redirect to `/login`
  - Try `/report-issue`
  - Should redirect to `/login`

- [ ] **Invalid Token**
  - Open DevTools → Application → localStorage
  - Edit user_token value to something invalid
  - Refresh page
  - Should see error or redirect to login

- [ ] **Password Security**
  - Register new user
  - Check MongoDB - password should NOT be plain text
  - Password should be hashed (long string of characters)

- [ ] **Admin Check**
  - Register with email "admin_user@company.com"
  - Should have admin role
  - Register with email "user@company.com"
  - Should have citizen role
  - Register with email "administrator@test.org"
  - Should have admin role (has "admin")

## 🖼️ UI/UX Testing

- [ ] **Responsive Design**
  - View on desktop (1920px)
  - View on tablet (768px)
  - View on mobile (375px)
  - All elements should be readable and clickable

- [ ] **Form Validation**
  - Try to register with invalid email
  - Should show error
  - Try to submit issue without title
  - Should show error
  - Try to submit issue without category
  - Should show error

- [ ] **Error Messages**
  - Try login with wrong password
  - Should show "Invalid Credentials"
  - Try register with existing email
  - Should show "User already exists"
  - Try to upload non-image file
  - Should show error

- [ ] **Loading States**
  - Click submit on any form
  - Button should show loading state
  - Should be disabled during submission

- [ ] **Navigation**
  - Navbar should always be visible
  - Logo should link to home
  - Login/Register links should work
  - Should not show after login
  - After login, should show Logout button in dashboard

## 🗺️ Map Testing

- [ ] **Map Loads**
  - Go to report issue page
  - Map should render with CartoDB Voyager tiles
  - Should show India center view

- [ ] **Location Detection**
  - Click "Use My Current Location"
  - Browser should ask for permission
  - Allow permission
  - Map should zoom to current location
  - Red marker should appear
  - Address field should auto-fill

- [ ] **Manual Location Selection**
  - Drag marker to new location
  - Address should update via Nominatim
  - Drag to another location
  - Address should update again

- [ ] **Address Manual Entry**
  - Clear address field
  - Type address manually
  - Should be able to submit without using map

## 📱 API Testing (Optional - with Postman)

- [ ] **Register Endpoint**
  - POST to `http://localhost:5000/api/auth/register`
  - Should return token and user data
  - Status 400 if email exists

- [ ] **Login Endpoint**
  - POST to `http://localhost:5000/api/auth/login`
  - Should return token and user data
  - Status 400 if credentials wrong

- [ ] **Create Issue Endpoint**
  - POST to `http://localhost:5000/api/issues`
  - Use FormData with x-auth-token header
  - Should return created issue
  - Status 401 without token

- [ ] **Get Issues Endpoint**
  - GET to `http://localhost:5000/api/issues`
  - Citizen should see only own issues
  - Admin should see all issues
  - Status 401 without token

- [ ] **Admin Stats Endpoint**
  - GET to `http://localhost:5000/api/admin/stats`
  - Should return stats with counts
  - Status 403 if not admin

## 📝 Final Checklist

- [ ] All citizen features working
- [ ] All admin features working
- [ ] No console errors (F12)
- [ ] No network errors in DevTools
- [ ] Responsive on all screen sizes
- [ ] JWT tokens working
- [ ] Images uploading to Cloudinary
- [ ] Database records being saved
- [ ] Real-time updates working
- [ ] All buttons clickable
- [ ] All forms submitting
- [ ] Filters working correctly
- [ ] Permissions enforced

## 🐛 Bug Report Template

If you find an issue, provide:

```
Title: [Brief description]
Steps to Reproduce:
1. 
2. 
3. 

Expected Result:
[What should happen]

Actual Result:
[What actually happens]

Console Error:
[Any error messages from F12]

Browser:
[Chrome, Firefox, Safari, etc]

Platform:
[Windows, Mac, Linux, Mobile]
```

---

**When all items are checked, CivicReporter is ready for production! ✅**
