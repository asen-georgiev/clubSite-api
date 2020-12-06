const config = require("config");

//Функция за извикване на Прайвът Кий от default.json файла
//Задължителен експорт при всяко стартиране на програмата
//export jwtPrivateKey=secondPrivateKey
module.exports = function () {
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined!');
    }
};
