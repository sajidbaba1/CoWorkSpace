const multer = require('multer');
const path = require('path');

// Set storage engine
const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }
});

// Check file type
// Check file type
function checkFileType(file, cb) {
    // Log file info for debugging
    console.log('File upload attempt:', {
        name: file.originalname,
        mimetype: file.mimetype,
        ext: path.extname(file.originalname).toLowerCase()
    });

    const filetypes = /jpeg|jpg|png|pdf/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error(`Error: Images or PDFs Only! Got: ${file.mimetype}`));
    }
}

module.exports = upload;
