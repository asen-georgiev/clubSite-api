const mongoose = require('mongoose');
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const config = require('config');


//Юзър скимата, която отговаря за това какви данни ще има в ДБ на МонгоДБ
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 8,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean
    }
});

//Generathing authentication token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

//Създаване на Юзър модел по Юзър скимата
const User = mongoose.model('User', userSchema);

//Функция, която валидира данните, които юзъра подава към сървъра от Юзър Интерфейса
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().email().min(8).max(50),
        password: Joi.string().required().min(8).max(255),
        isAdmin: Joi.boolean().required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
