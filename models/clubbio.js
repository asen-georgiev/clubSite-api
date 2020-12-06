const mongoose = require('mongoose');
const Joi = require("joi");

const clubbioSchema = new mongoose.Schema({
    bioTitle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    bioText: {
        type: String,
        required: true,
        minlength: 5
    }
})


const ClubBio = mongoose.model('ClubBio', clubbioSchema);

function validateClubBio(clubBio) {
    const schema = Joi.object({
        bioTitle: Joi.string().required().min(5).max(50),
        bioText: Joi.string().required().min(5)
    })
    return schema.validate(clubBio);
}

exports.ClubBio = ClubBio;
exports.validateClubBio = validateClubBio;
exports.clubbioSchema = clubbioSchema;
