# CivicReporter - Community Issue Reporting Platform

A full-stack web application that allows citizens to report and track community issues in real-time, with admin capabilities to manage and resolve reports.

## Features

### 👤 Citizen Features
- **Secure Authentication**: Sign-up and login using JWT tokens
- **Issue Reporting**: Create and submit issues with:
  - Title, description, location, and category
  - Multimedia support (image uploads via Cloudinary)
  - Interactive map-based location selection
- **Real-time Status Tracking**: Monitor issue status updates (Reported → In Progress → Resolved)
- **Issue Management**: Delete only user-submitted issues
- **Issue Categories**: Road Infrastructure, Waste Management, Public Safety, Water Supply, Other

### 🛡️ Admin Features
- **Dashboard**: View all reported issues with statistics
- **Issue Management**: 
  - Update issue status (Reported → In Progress → Resolved)
  - Delete any issue in the system
- **Filtering & Search**: Access filtered or categorized issue data
- **Statistics**: Real-time metrics on total, pending, in-progress, and resolved issues
- **Bulk Actions**: Quick status updates for multiple issues

## Tech Stack

### Frontend
- **Framework**: Angular 18+ (Standalone Components)
- **Styling**: Tailwind CSS
- **Forms**: Reactive Forms
- **HTTP**: HttpClient
- **Maps**: Leaflet.js
- **Animations**: Angular Animations

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Cloudinary (Image Storage)
- **Validation**: Zod
- **Middleware**: CORS, Morgan

## Project Structure

```
CivicReporter/
├── client/                    # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Services & Guards
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   └── admin.guard.ts
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.ts
│   │   │   │       ├── issue.service.ts
│   │   │   │       └── admin.service.ts
│   │   │   ├── features/      # Feature Modules
│   │   │   │   ├── auth/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── issue-reporting/
│   │   │   │   └── landing/
│   │   │   ├── shared/        # Shared Components
│   │   │   ├── app.routes.ts
│   │   │   └── app.config.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                    # Express Backend
    ├── models/               # MongoDB Schemas
    │   ├── User.js
    │   └── Issue.js
    ├── controllers/          # Business Logic
    │   ├── authController.js
    │   └── issueController.js
    ├── routes/              # API Routes
    │   ├── auth.js
    │   ├── issues.js
    │   └── adminRoutes.js
    ├── middleware/          # Custom Middleware
    │   ├── auth.js          # JWT Verification
    │   ├── isAdmin.js       # Admin Check
    │   └── uploadMiddleware.js
    ├── config/
    │   └── cloudinary.js    # Cloudinary Setup
    ├── utils/
    │   └── validation.js    # Zod Schemas
    ├── index.js             # Server Entry
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier: cloudinary.com)
- Angular CLI 18+

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   npm install
   ```

2. **Create `.env` file** (use `.env.example` as template):
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/civic-reporter
   JWT_SECRET=your_secret_key_here
   ```

3. **Setup Cloudinary** (for image uploads):
   - Create account at cloudinary.com
   - Get your Cloud Name, API Key, and API Secret
   - Update `server/config/cloudinary.js` with your credentials

4. **Start the server**:
   ```bash
   npm run dev    # Development (with nodemon)
   npm start      # Production
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   npm install
   ```

2. **Install Leaflet for maps** (if not already included):
   ```bash
   npm install leaflet
   npm install @types/leaflet --save-dev
   ```

3. **Start Angular dev server**:
   ```bash
   ng serve
   ```

   Frontend will be available at `http://localhost:4200`

## API Endpoints

### Authentication Routes (`/api/auth`)

```
POST   /register          Register new user
POST   /login             Login user
```

### Issue Routes (`/api/issues`)

```
GET    /                  Get issues (citizens: own, admins: all)
GET    /:id               Get single issue
POST   /                  Create new issue (with image upload)
PUT    /:id/status        Update issue status (admin only)
DELETE /:id               Delete issue (owner or admin)
```

### Admin Routes (`/api/admin`)

```
GET    /issues            Get all issues (with filtering)
GET    /stats             Get issue statistics
GET    /category/:cat     Get issues by category
PATCH  /issues/:id/status Update issue status
DELETE /issues/:id        Delete any issue
```

## User Roles

### Citizen
- Can register and login
- Submit new issues with images
- View only their own issues
- Delete only their own issues
- Track status of submitted issues

### Admin
- Can access admin dashboard
- View all issues in the system
- Filter issues by category/status
- Update issue status
- Delete any issue
- View system statistics

**Admin Detection**: Users with "admin" in their email are automatically set as admins on registration.

## Authentication Flow

1. User registers with email, name, and password
2. Password is hashed using bcryptjs
3. JWT token is generated and stored in localStorage
4. Token is sent in request headers as `x-auth-token`
5. Backend verifies token on protected routes
6. Token expires after 1 hour (configurable in auth routes)

## Image Upload Process

1. User selects image in report form
2. Image is sent to Cloudinary via multer
3. Cloudinary stores and returns secure URL
4. URL is saved in MongoDB Issue document
5. Frontend displays image from Cloudinary CDN

## Real-time Features

- Issue status updates appear immediately
- Dashboard refreshes automatically
- Statistics update in real-time
- Filtering works instantly

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Role-based access control
- Admin-only routes
- Input validation with Zod

## Error Handling

- Form validation on frontend
- Server-side input validation
- HTTP error codes (400, 401, 403, 404, 500)
- User-friendly error messages

## Development

### Running Tests
```bash
# Backend
cd server
npm test

# Frontend
cd client
ng test
```

### Code Style
- ESLint for JavaScript/TypeScript
- Prettier for formatting (optional)
- Tailwind CSS utilities for styling

## Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or similar
- Set environment variables in hosting platform
- Use MongoDB Atlas for database

### Frontend (Angular)
- Build: `ng build --prod`
- Deploy to Vercel, Netlify, or Firebase Hosting

## Troubleshooting

### Map not loading?
- Check Leaflet CSS is imported: `npm install leaflet`
- Verify OSM/CartoDB tile URLs are accessible

### Images not uploading?
- Verify Cloudinary credentials in `server/config/cloudinary.js`
- Check file size limit (5MB default)
- Ensure only image formats are allowed

### JWT errors?
- Clear localStorage and login again
- Verify JWT_SECRET is set in `.env`
- Check token expiration time

## Future Enhancements

- [ ] Real-time notifications
- [ ] Issue comments/updates
- [ ] User reputation system
- [ ] Report analytics
- [ ] Mobile app
- [ ] Email notifications
- [ ] Google Maps integration
- [ ] Advanced filtering & search

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues or questions, please open a GitHub issue or contact the maintainers.

---

**Built with ❤️ for community improvement**
