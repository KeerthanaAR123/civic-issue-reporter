# Quick Start Guide - CivicReporter

## 5-Minute Setup

### Step 1: Backend Setup (Terminal 1)

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/civic-reporter
JWT_SECRET=your_super_secret_key_12345
```

Start MongoDB locally (if you have it):
```bash
mongod
```

Start the server:
```bash
npm run dev
```

You should see: `Server running on port 5000`

### Step 2: Frontend Setup (Terminal 2)

```bash
cd client
npm install
ng serve
```

Open browser: `http://localhost:4200`

## Test the Application

### Create Admin User
1. Click "Sign up"
2. Enter email with "admin" in it (e.g., `admin@test.com`)
3. Set password and name
4. Go to Dashboard - you'll see **Admin Dashboard**

### Create Citizen User
1. Click "Sign up"
2. Enter regular email (e.g., `user@test.com`)
3. Set password and name
4. Go to Dashboard - you'll see **Citizen Dashboard**

### Report an Issue (Citizen)
1. Login as citizen
2. Click "+ Report New Issue"
3. Fill in:
   - Title: "Broken Streetlight"
   - Category: "Public Safety"
   - Click "Use My Current Location" or drag map marker
   - Description: "The light at corner is broken"
   - Upload an image (optional)
4. Click "Submit Report"

### View & Update Issues (Admin)
1. Login as admin
2. See all issues in the table
3. Click status dropdown to change (Reported → In Progress → Resolved)
4. Use filters to view by Category or Status
5. Click trash icon to delete issues

## Image Upload Setup (Optional but Recommended)

For real image uploads:

1. Create free account at https://cloudinary.com
2. Get your credentials from dashboard
3. Update `server/config/cloudinary.js`:
   ```javascript
   cloudinary.config({
     cloud_name: 'YOUR_CLOUD_NAME',
     api_key: 'YOUR_API_KEY',
     api_secret: 'YOUR_API_SECRET'
   });
   ```

## API Testing with Postman

### Register User
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123"
}
```

### Login User
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@test.com",
  "password": "password123"
}
```

Response includes JWT token - copy it for next requests.

### Get Issues
```
GET http://localhost:5000/api/issues
Header: x-auth-token: <your_token>
```

### Create Issue
```
POST http://localhost:5000/api/issues
Header: x-auth-token: <your_token>
Body: FormData {
  "title": "Pothole",
  "description": "Large hole in road",
  "category": "Road Infrastructure",
  "address": "123 Main St",
  "image": <file>
}
```

### Update Issue Status (Admin)
```
PUT http://localhost:5000/api/issues/<issue_id>/status
Header: x-auth-token: <admin_token>
Body: {
  "status": "In Progress"
}
```

## Features Checklist

✅ Citizen Sign-up & Login with JWT
✅ Create Issues with:
  - Title, description, location, category
  - Image upload to Cloudinary
  - Map-based location selection
✅ Track issue status in real-time
✅ Citizens delete only their own issues
✅ Admin Dashboard:
  - View all issues
  - Update status (Reported → In Progress → Resolved)
  - Delete any issue
  - Filter by category/status
  - View statistics

## Common Issues & Fixes

**Map not showing?**
- Refresh browser
- Check browser console for errors
- Ensure Leaflet is installed: `npm install leaflet`

**Images not uploading?**
- Update Cloudinary credentials
- Check image file size < 5MB
- Use JPG/PNG formats

**JWT errors?**
- Clear localStorage: F12 → Application → localStorage → Clear
- Logout and login again
- Verify JWT_SECRET is set in .env

**MongoDB Connection Error?**
- Start MongoDB: `mongod`
- Or change MONGO_URI to Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/civic-reporter`

## Production Deployment

See main README.md for deployment instructions to Heroku, Vercel, etc.

---

**Need help? Check the main README.md for more details!**
