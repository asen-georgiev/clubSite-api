const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User,validateUser} = require('../models/user');


//Руут за аутентикация на вече съществуващ Юзър с Парола в базата данни
//req = рикуест от фронтенда, res = респонс от бекенда
router.post('/',async(req, res) => {

        //Функция, която валидира инпут данните от Юзъра и проверява, дали отговарят
        //на Joi schema та.
        const {error} = validateAuthentication(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        //Асинхронен рикуест, която изчаква респонс от сървъра и проверява, дали
        //подаденият имейл съществува в базата данни и е валиден
        let user = await User.findOne({email: req.body.email});
        if(!user) return res.status(401).send('Invalid email!');

        //Асинхронен рикуест, който изчаква БКРИПТ да сравни подадената от Юзъра парола,
        //със съществуващата такава на Юзъра в базата данни
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if(!validPassword) return res.status(401).send('Invalid password!');

        //Ако подаденият от Юзъра юзър е съществуващ в ДБ, то се извиква функцията за
        //генериране на токен (от Юзър модела) и се връща, като риспонс хедър към Юзъра
        //(в Реакт ще трябва да запазим тези данни в localStorage за да може да се извикват, при
        //последвалата Ауторизация
        const token = user.generateAuthToken();
        res.header('x-auth-token',token).send(token)
})


    //Функция за валидиране на данните въведени от Юзъра
    function validateAuthentication(req){
        const schema = Joi.object({
            email: Joi.string().required().email().min(5).max(50),
            password: Joi.string().required().min(8).max(255)
        })
        return schema.validate(req);
    }


module.exports = router;
