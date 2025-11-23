const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Bat_Vehicles = require('./bat_vehicles.model');

const Character_Bat_Vehicles = sequelize.define('Character_Bat_Vehicles', {
   bat_vehicle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Bat_Vehicles,
        key: "bat_vehicle_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    character_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Characters,
        key: "character_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  
  {
    tableName: "Character_Bat_Vehicles",
    timestamps: false,
  }
);

Characters.hasMany(Character_Bat_Vehicles, { foreignKey: "character_id" });
Character_Bat_Vehicles.belongsTo(Characters, { foreignKey: "character_id" });

Bat_Vehicles.hasMany(Character_Bat_Vehicles, { foreignKey: "bat_vehicle_id" });
Character_Bat_Vehicles.belongsTo(Bat_Vehicles, { foreignKey: "bat_vehicle_id" });

module.exports = Character_Bat_Vehicles;