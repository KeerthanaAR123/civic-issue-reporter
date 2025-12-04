# CivicReporter - Verification Checklist ✅

## Pre-Launch Verification

Run through this checklist to ensure the project is ready:

### Backend Setup
- [ ] MongoDB is running (default: localhost:27017)
- [ ] Node.js is installed (`node --version` shows v14+)
- [ ] Navigate to `server` directory: `cd server`
- [ ] Install dependencies: `npm install`
- [ ] Start server: `node index.js`
- [ ] See message: "Connected to MongoDB" and server running on port 5000

### Frontend Setup  
- [ ] Node.js and npm are installed (`npm --version` shows v6+)
- [ ] Navigate to `client` directory: `cd client`
- [ ] Dependencies installed: `ls node_modules | head`
- [ ] Start dev server: `npm start`
- [ ] Angular dev server loads on http://localhost:4200
- [ ] No compilation errors in terminal

### Database & Auth
- [ ] MongoDB has `civicreporter` database created
- [ ] Can access MongoDB: `mongosh` or MongoDB Compass
- [ ] JWT secret is configured in `server/index.js`
- [ ] Cloudinary API keys are set if using image upload

### Frontend Components
- [ ] Landing page loads at http://localhost:4200
- [ ] Sign Up page accessible
- [ ] Login page working
- [ ] Can register new user without errors

### Authentication Testing
- [ ] **Citizen Registration**: Create user with normal email (e.g., john@example.com)
  - [ ] User created successfully
  - [ ] Can login with credentials
  - [ ] Token stored in localStorage
  
- [ ] **Admin Registration**: Create user with "admin" in email (e.g., admin@example.com)
  - [ ] User created with admin role
  - [ ] Can login successfully
  - [ ] Can access admin routes

### Citizen Features
- [ ] Logged in as citizen user
- [ ] Dashboard shows no issues initially
- [ ] Can navigate to "Report New Issue"
- [ ] Issue form has all fields:
  - [ ] Title input
  - [ ] Category dropdown
  - [ ] Description textarea
  - [ ] Map for location selection
  - [ ] Image upload button
- [ ] Can submit issue successfully
- [ ] Issue appears on dashboard
- [ ] Issue card shows:
  - [ ] Image thumbnail
  - [ ] Title and description
  - [ ] Category badge
  - [ ] Location
  - [ ] Status (should be "Reported")
- [ ] Can delete own issue
- [ ] After deletion, issue removed from dashboard

### Admin Features
- [ ] Logout as citizen
- [ ] Login as admin user
- [ ] Redirected to admin dashboard at `/admin` (NOT citizen dashboard)
- [ ] Admin dashboard shows statistics:
  - [ ] Total Issues count
  - [ ] Pending Issues count
  - [ ] In Progress count
  - [ ] Resolved count
- [ ] Issues table displays all citizen-submitted issues
- [ ] Can filter by category
- [ ] Can filter by status
- [ ] Can update issue status via dropdown
- [ ] Can delete any issue
- [ ] "Reply" button visible on each issue in table

### Admin Response System (NEW)
- [ ] Admin clicks "Reply" button on an issue
- [ ] Response modal opens showing:
  - [ ] Issue title in header
  - [ ] Issue details (reporter name, email, category, location, status)
  - [ ] Issue image if exists
  - [ ] Large textarea for response
  - [ ] Character counter
  - [ ] "Send Response" button
- [ ] Admin types response message
- [ ] Clicks "Send Response"
- [ ] Modal closes
- [ ] Success message appears
- [ ] Response status in table changes to "✓ Responded"

### Citizen Views Admin Response (NEW)
- [ ] Logout as admin
- [ ] Login as citizen
- [ ] Go to dashboard
- [ ] Issue card now shows blue response box with:
  - [ ] Message icon
  - [ ] "Admin Response" label
  - [ ] Response text (what admin typed)
  - [ ] Date and time format: "Month DD, YYYY h:mm a"
- [ ] Can still delete own issue even after response

### API Testing (Optional - Postman/curl)
- [ ] **Test Citizen Login**
  ```
  POST http://localhost:5000/api/auth/login
  Body: {"email":"citizen@example.com","password":"password123"}
  Response: 200 OK with token
  ```

- [ ] **Test Get All Issues (as Admin)**
  ```
  GET http://localhost:5000/api/admin/issues
  Header: x-auth-token: [token]
  Response: 200 OK with issues array
  ```

- [ ] **Test Add Response (NEW)**
  ```
  PATCH http://localhost:5000/api/admin/issues/[issue_id]/response
  Header: x-auth-token: [admin_token]
  Body: {"adminResponse":"Response text here"}
  Response: 200 OK with updated issue
  ```

- [ ] **Verify Response Fields**
  - [ ] Response includes `adminResponse` field
  - [ ] Response includes `responseDate` field
  - [ ] Response includes other issue fields

### Error Handling
- [ ] Try login with wrong password → Error message displayed
- [ ] Try accessing `/admin` as citizen → Redirected to citizen dashboard
- [ ] Try accessing `/admin` without login → Redirected to login
- [ ] Try submitting empty response → Error message: "Please enter a response"
- [ ] Network error handling → Show appropriate error messages

### Performance
- [ ] Page loads quickly (no lag)
- [ ] Dashboard renders all issues smoothly
- [ ] Response modal opens instantly
- [ ] No console errors (F12 → Console tab)
- [ ] No network failures (F12 → Network tab)

### Final Verification
- [ ] Both terminal windows running without errors
- [ ] Frontend and backend communicating successfully
- [ ] All CRUD operations working (Create, Read, Update, Delete)
- [ ] Admin-to-citizen communication working
- [ ] Citizen can view admin responses
- [ ] No security vulnerabilities apparent
- [ ] Data persists after page refresh

## Test Scenarios

### Scenario 1: Complete Issue Lifecycle
1. Citizen registers and logs in
2. Citizen creates issue with image
3. Citizen goes to dashboard
4. Admin logs in to admin dashboard
5. Admin sees citizen's issue
6. Admin changes status to "In Progress"
7. Admin clicks Reply and adds response
8. Citizen logs in, sees response on issue card
9. Issue resolution complete ✅

### Scenario 2: Multiple Citizens, Multiple Issues
1. Register 2-3 different citizen accounts
2. Each citizen creates 2-3 issues
3. Admin views admin dashboard
4. Verify all issues visible
5. Admin responds to some, not others
6. Each citizen logs in and verifies their own issues and responses only ✅

### Scenario 3: Status Workflow
1. Issue starts as "Reported"
2. Admin changes to "In Progress"
3. Verify status updates in table
4. Admin adds response
5. Admin changes to "Resolved"
6. Citizen sees final status and response ✅

## Deployment Checklist

Before production deployment:

- [ ] Environment variables configured (.env file)
- [ ] MongoDB connection string updated for production
- [ ] Cloudinary API keys secured in environment variables
- [ ] JWT secret configured and secured
- [ ] CORS settings configured for production domain
- [ ] Error logging implemented
- [ ] Rate limiting enabled
- [ ] Input validation strict
- [ ] Passwords hashed (bcryptjs configured)
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Admin account created for production

## Quick Start Commands

```bash
# Terminal 1: Backend
cd server
npm install
node index.js

# Terminal 2: Frontend
cd client
npm install
npm start

# Then open browser to http://localhost:4200
```

## Support Resources

- See README.md for general overview
- See QUICKSTART.md for setup guide
- See API_DOCUMENTATION.md for full API reference
- See API_ENDPOINTS_UPDATE.md for new response endpoint
- See TROUBLESHOOTING.md for common issues

---

**Verification Status**: Ready to test ✅  
**Admin Response Feature**: Implemented and ready ✅  
**All Dependencies**: Installed and working ✅
