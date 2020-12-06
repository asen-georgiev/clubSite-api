const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User, validateUser} = require('../models/user');
const bcrypt = require('bcrypt');
const authorization = require('../middleware/authorization');
const admin = require('../middleware/administration');


//Показване на кърънт юзър
router.get('/me', authorization, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})


//Асинхронна функция за показване на всички регистрирани в ДБ юзъри (изисква ауторизация от middleware)
router.get('/', authorization, async (req, res) => {
    const users = await User
        .find()
        .select("-__v")
        .sort('name');
    res.send(users);
})


//Асинхронна функция за показване на Юзър по ИД
router.get('/:id', authorization,async (req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User with the given ID was not found!');
    res.send(user);
})


//Асинхронна функция за създаване на нов Юзър в ДБ
router.post('/', authorization,async (req, res) => {
    //Валидация на данните подадени от Юзъра в рикуеста, дали отговарят на
    //изискванията на Joi schemata от (User model)
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Проверява, дали има съществуващ вече Юзър в ДБ с такъв имейл и ако ДА - прекратява създаването на нов юзър
    let user = await User.findOne({email: req.body.email});
    const reqEmail = req.body.email;
    if (user) return res.status(409).send(`User with email: ${reqEmail} already exists.`);

    //Създаване на нов юзър Обект, лоудаш ни показва, кои полета трябва да се попълнят
    //Б.А.Трябва да се проверява лоудаш да не се бие със схемата и модела на USER
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));

    //Генериране на САЛТ от БКРИПТ и хашване на паролата в ДБ
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //Запазване на Юзъра в ДБ
    await user.save();

    //При правилна регистрация на нов Юзър в хедъра се връща валиден токен,
    //за да не е нужна повторна аутентикация и логване
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

})

//Updating user by ID
router.put('/:id', authorization,async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);

    const user = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
            isAdmin: req.body.isAdmin
        },
        {new: true});

    if (!user) return res.status(404).send("The user with the given ID was not found.");
    res.send(user);
})

//Deleting user by ID
router.delete('/:id', authorization,async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if (!user) return res.status(404).send(`User with ID: ${reqId} was not found!`);
    res.send(user);
})
module.exports = router;
