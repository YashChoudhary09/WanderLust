const cloudinary = require('cloudinary').v2; // add cloudinary package 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({  // connect with cloudinary 
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({  // multer save the frontend files in storage in folder on cloudinary cloud services
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_dev',
      allowedFormats: ["png","jpg","jpeg"],
    },
  });
   
module.exports = {cloudinary,storage};