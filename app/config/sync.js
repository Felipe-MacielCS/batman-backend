const sequelize = require('./db');
//const User = require('../models/user')


(async () => {
    try{
        await sequelize.sync({ force:true });
        console.log('Tables created');
        process.exit();
    } catch (err) {
        console.error('Error', err);
    }
})();