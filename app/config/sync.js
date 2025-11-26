const sequelize = require('./db');
require('../models/characters.model');
require('../models/bat_family.model');
require('../models/teams.model');
require('../models/character_teams.model');
require('../models/supporting.model');
require('../models/aliases.model');
require('../models/medias.model');
require('../models/character_medias.model');
require('../models/bat_weapons.model');
require('../models/character_bat_weapons.model');
require('../models/bat_vehicles.model');
require('../models/character_bat_vehicles.model');
require('../models/bat_equipments.model');
require('../models/character_bat_equipments.model');
require('../models/places.model');
require('../models/character_places.model');

(async () => {
    try{
        await sequelize.sync({ force:true });
        console.log('Tables created');
        process.exit();
    } catch (err) {
        console.error('Error', err);
    }
})();