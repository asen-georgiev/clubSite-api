const config = require('config');
const jwt = require('jsonwebtoken');


//Function fou authorization if the USER that is trying to get some data is
//Authorized with a valid token.
    function authorization (req,res,next){
        //Взимаме данните за токена от хедъра на рикуеста на юзъра
        const token = req.header('x-auth-token');
        if(!token) return res.status(401).send('Access denied! No token provided!');

        //Трай Кеч блок, който сравнява токена и прайвът кий дали отговарят на
        //Юзърз от рикуеста при декодинг
        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.user = decoded;
            next();
        }
        catch (e) {
           res.status(400).send('Invalid token');
        }
    }
    module.exports = authorization;
