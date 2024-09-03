import multer from 'multer';
import path from 'path';

// Define storage for the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/temp'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Define file filter for specific file types if needed
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// Initialize multer with the storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB limit
  }
});

export default upload;
