const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// REPLACE THESE WITH YOUR REAL CREDENTIALS FROM CLOUDINARY DASHBOARD
cloudinary.config({
  cloud_name: 'dr4lyzpiz',
  api_key: '661989622694778',
  api_secret: 'Q2iUlkEJLgxld5fUeOA-4-3lgMk'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'civic-reporter',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

module.exports = { cloudinary, storage };
