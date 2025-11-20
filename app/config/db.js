const {Sequelize} = require('sequelize');

// new sequelize instance credentials
const sequelize = new Sequelize('ormDB', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;