const {Sequelize} = require('sequelize');

// new sequelize instance credentials
const sequelize = new Sequelize('batman', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;