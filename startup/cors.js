const cors = require("cors");

//Функция свързана с КОРС, за да могат РЕАКТ и НОДЕ да работят синхронизирано
module.exports = function(app) {
    app.use(cors());
};
