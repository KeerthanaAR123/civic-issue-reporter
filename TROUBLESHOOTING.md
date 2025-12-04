# CivicReporter - Troubleshooting Guide

Common issues and their solutions.

## 🔴 Backend Issues

### Issue: "Cannot find module 'express'" or other npm modules

**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Issue: MongoDB Connection Error

**Error:** `MongooseError: Cannot connect to MongoDB`

**Solutions:**
1. **Start MongoDB locally:**
   ```bash
   mongod
   ```

2. **Or use MongoDB Atlas (cloud):**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account
   - Create database cluster
   - Get connection string
   - Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-reporter?retryWrites=true&w=majority
   ```

3. **Verify connection string format:**
   - Should start with `mongodb://` or `mongodb+srv://`
   - Should include database name

### Issue: "EADDRINUSE: address already in use :::5000"

**Solution:**
The port 5000 is already in use.

Option 1: Kill process using port 5000
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Option 2: Use different port
```bash
# Change in .env
PORT=5001

# Start server
npm run dev
```

### Issue: JWT_SECRET not set

**Error:** `Error: jwt.sign requires a secret key`

**Solution:**
Add to `.env`:
```
JWT_SECRET=your_secret_key_minimum_32_characters_long
```

### Issue: Cloudinary upload failing

**Error:** `Error: Cloudinary upload failed`

**Solutions:**
1. **Verify credentials in `server/config/cloudinary.js`:**
   ```javascript
   cloudinary.config({
     cloud_name: 'YOUR_CLOUD_NAME',
     api_key: 'YOUR_API_KEY',
     api_secret: 'YOUR_API_SECRET'
   });
   ```

2. **Get credentials:**
   - Go to https://cloudinary.com/console
   - Login/Sign up (free tier available)
   - Copy Cloud Name, API Key, API Secret
   - Paste into config file

3. **Test upload:**
   ```bash
   curl -X POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload \
     -F "file=@test.jpg" \
     -F "api_key={api_key}" \
     -F "api_secret={api_secret}"
   ```

### Issue: CORS errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
Already configured in `server/index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

For production, update to:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
```

---

## 🔴 Frontend Issues

### Issue: "Cannot find module '@angular/...' or npm packages"

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 4200 already in use"

**Solution:**
```bash
# Use different port
ng serve --port 4201

# Or kill process using 4200
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process
```

### Issue: Map not loading

**Error:** Map shows gray background or doesn't render

**Solutions:**
1. **Verify Leaflet CSS is loaded:**
   - F12 → Network tab
   - Look for Leaflet CSS file
   - Should be loaded from CDN or node_modules

2. **Add to `angular.json`:**
   ```json
   "styles": [
     "src/styles.css",
     "node_modules/leaflet/dist/leaflet.css"
   ]
   ```

3. **Refresh browser:**
   ```bash
   Ctrl+Shift+R (hard refresh)
   ```

4. **Check console errors:**
   - F12 → Console
   - Should see Leaflet loaded
   - No 404 errors for map tiles

### Issue: Images not showing in dashboard

**Solutions:**
1. **Check image URL format:**
   - Cloudinary URLs: `https://res.cloudinary.com/...`
   - Local uploads: `http://localhost:5000/uploads/...`

2. **Verify CORS for images:**
   - Images from Cloudinary should work (has CORS)
   - Local images need `/uploads` route configured

3. **Check backend `/uploads` route:**
   ```javascript
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```

### Issue: Login/Register not working

**Error:** Form submits but nothing happens

**Solutions:**
1. **Check network in DevTools:**
   - F12 → Network tab
   - Click submit
   - Look for `/api/auth/register` or `/api/auth/login`
   - Check response status (should be 200 or error code)

2. **Check console for errors:**
   - F12 → Console
   - Should see response data
   - Should see token in localStorage

3. **Verify backend is running:**
   - Terminal should show "Server running on port 5000"
   - Check `http://localhost:5000/api/auth/login` is accessible

4. **Check CORS headers:**
   - Network tab → Response headers
   - Should have `Access-Control-Allow-Origin: http://localhost:4200`

### Issue: Token not saving

**Error:** After login, token not in localStorage

**Solutions:**
1. **Check localStorage access:**
   - F12 → Application → Storage → localStorage
   - Should see `user_token` and `user_data`

2. **Verify auth service:**
   - Check `client/src/app/core/services/auth.service.ts`
   - Should have `handleAuthSuccess` method

3. **Check response from backend:**
   - Should include `token` field
   - Token should be non-empty string

### Issue: 401 Unauthorized on all requests

**Error:** All API calls return 401 (Unauthorized)

**Solutions:**
1. **Check token is being sent:**
   - Network tab → Request headers
   - Should have `x-auth-token: <token>`

2. **Verify token format:**
   - Should start with `eyJ` (JWT header)
   - Should have 3 parts separated by `.`

3. **Clear and re-login:**
   ```javascript
   // In console
   localStorage.clear()
   // Then refresh and login again
   ```

4. **Check JWT_SECRET matches:**
   - Frontend and backend should use same secret
   - Verify in `.env` file

### Issue: Dashboard not loading

**Error:** Blank dashboard or loading spinner stuck

**Solutions:**
1. **Check network requests:**
   - F12 → Network tab
   - Look for `/api/issues` request
   - Check response status and data

2. **Check auth state:**
   - Should be logged in
   - `authService.currentUser()` should have data

3. **Reload page:**
   - Hard refresh: Ctrl+Shift+R
   - Clear localStorage and login again

4. **Check console errors:**
   - F12 → Console
   - Should not see red errors
   - Check network errors

---

## 🔴 Image Upload Issues

### Issue: "Images only!" error

**Solution:**
Only JPG/PNG/JPEG allowed. File must be:
- Image file
- Less than 5MB
- One of these formats: jpg, png, jpeg

### Issue: Upload succeeds but image doesn't display

**Solutions:**
1. **Check Cloudinary:**
   - Go to https://cloudinary.com/console/media_library
   - Should see uploaded image
   - Copy URL and test in browser

2. **Check image URL:**
   - Should start with `https://res.cloudinary.com/`
   - URL should be complete and valid

3. **Check CORS:**
   - Cloudinary has CORS enabled by default
   - Local images need `/uploads` route

### Issue: Cloudinary credentials not working

**Error:** Upload returns 401 or 403

**Solution:**
1. Verify credentials are correct:
   ```bash
   curl https://api.cloudinary.com/v1_1/{cloud_name}/resources/image \
     -u {api_key}:{api_secret}
   ```

2. Re-copy credentials:
   - Go to https://cloudinary.com/console
   - Copy exact values (no spaces)
   - Paste into `server/config/cloudinary.js`

---

## 🔴 Database Issues

### Issue: Data not persisting

**Error:** Create issue, refresh page, issue is gone

**Solutions:**
1. **Check MongoDB connection:**
   - Start MongoDB
   - Check `.env` MONGO_URI

2. **Check database:**
   - Connect to MongoDB Compass or Atlas
   - Database should be `civic-reporter`
   - Collections should have `users` and `issues`

3. **Check create endpoint response:**
   - Should return created issue with `_id`
   - If no `_id`, DB save failed

### Issue: Duplicate users

**Error:** Can register same email twice

**Solution:**
Email field should be unique in schema.

Check `server/models/User.js`:
```javascript
email: { type: String, required: true, unique: true }
```

If not unique, rebuild database:
```bash
# Drop database and restart
# Or fix schema and recreate
```

---

## 🔴 Deployment Issues

### Issue: Works locally but not in production

**Solutions:**
1. **Update URLs:**
   - Backend: `process.env.FRONTEND_URL`
   - Frontend: `environment.ts` with production URLs

2. **Update CORS:**
   ```javascript
   origin: process.env.FRONTEND_URL || 'http://localhost:4200'
   ```

3. **Set environment variables:**
   - PORT
   - MONGO_URI (use Atlas)
   - JWT_SECRET (strong key)
   - Cloudinary credentials

4. **Build frontend:**
   ```bash
   ng build --prod
   ```

### Issue: "Cannot GET /"

**Error:** Frontend deployment shows 404

**Solution:**
Configure server to serve SPA:
```javascript
// After routes, add:
app.get('*', (req, res) => {
  res.sendFile('client/dist/index.html');
});
```

---

## ✅ Verification Checklist

After troubleshooting:

- [ ] Backend starts without errors
- [ ] Frontend compiles without errors
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token appears in localStorage
- [ ] Can see dashboard
- [ ] Can create issue
- [ ] Image uploads to Cloudinary
- [ ] Can see issue in dashboard
- [ ] Can update issue status
- [ ] Can delete issue
- [ ] Admin can see all issues
- [ ] No console errors (F12)
- [ ] No network errors

---

## 🆘 Getting Help

If you still have issues:

1. **Check logs:**
   - Backend terminal for errors
   - Browser console (F12)
   - Network tab for API errors

2. **Check configuration:**
   - `.env` file has all required variables
   - Cloudinary credentials are correct
   - MongoDB connection works

3. **Reset everything:**
   ```bash
   # Backend
   cd server
   npm install
   rm .env
   # Create new .env with correct values

   # Frontend
   cd client
   rm -rf node_modules dist
   npm install
   ```

4. **Ask for help:**
   - Check IMPLEMENTATION_SUMMARY.md
   - Check README.md
   - Check QUICKSTART.md

---

**Most issues are solved by checking logs and configuration! 🔍**
