const express = require('express');
const router = express.Router();
const sendGrid = require("@sendgrid/mail");
const {Email, validateEmail} = require('../models/email');
const _ = require('lodash');


const apiKey = process.env.SENDGRID_API_KEY;


router.post('/', async (req, res) => {
   const {error} = validateEmail(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   let email = new Email(_.pick(req.body,['fullname','email','subject','message']));
    await email.save();

    sendGrid.setApiKey(apiKey);
    const msg = {
        to: req.body.email,
        from: "georgievasen81@gmail.com",
        subject: req.body.subject,
        text: "Thank you, for your e-mail, we will contact you soon!",
    };
     sendGrid
        .send(msg)
        .then(() => {
            console.log('Email sent successfully!');
            res.status(200).send('Successfully sent through sendGrid API.');
        })
        .catch((error) => {
           res.status(401).send('There was an error sending the email through API.');
           console.log(error);
        });
});

module.exports = router;
