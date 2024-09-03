import path from 'path';
import { fileURLToPath } from 'url';

// Define the base URL for serving static files (adjust according to your setup)
const BASE_URL = 'https://chat-box-iota-gold.vercel.app'; // Replace with your actual base URL

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate the static file path for accessing the file via URL.
 * @param {Object} req - The request object
 * @param {string} filename - The name of the file
 * @returns {string} - The static file path
 */
const getStaticFilePath = (req, filename) => {
  return `${BASE_URL}/temp/${filename}`;
};

/**
 * Generate the local file path for accessing the file on the server.
 * @param {string} filename - The name of the file
 * @returns {string} - The local file path
 */
const getLocalPath = (filename) => {
  return path.join(__dirname, 'temp', filename);
};

export { getStaticFilePath, getLocalPath };
