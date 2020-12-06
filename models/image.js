const multer = require("multer");
const fs = require('fs');
const path = require('path');

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'gallery')
    },
    filename: function (req, file, cb) {
        //ako iskam da dobavi dneshna data dobavqm toq cod pred file.originalname: today.toDateString() + '-' +
        cb(null, file.originalname)
    }
});

const Upload = multer({storage: storage}).single('file');


//Get Array of Images from the directory folder
function getImagesFromDirectory(dirPath) {
    let allImages = [];
    let files = fs.readdirSync(dirPath);

    for (const file of files) {
        allImages.push(file);
    }
    return allImages;
}

exports.Upload = Upload;
exports.getImagesFromDirectory = getImagesFromDirectory;
