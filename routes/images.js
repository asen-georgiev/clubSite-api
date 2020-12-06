const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require("multer");
const {Upload,getImagesFromDirectory} = require('../models/image');
const authorization = require('../middleware/authorization');

//Post request for uploading image into gallery
router.post('/',authorization,async (req, res) => {

   Upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })

})

//Get request for retrieving images from gallery
router.get('/',(req, res) => {

    let images = getImagesFromDirectory( 'gallery');
    res.send(images);
})

module.exports = router;
