const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Bat_Vehicles = require('./bat_vehicles.model');

const Bat_Vehicles = sequelize.define('Bat_Vehicles', {
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
    tableName: "Bat_Vehicles",
    timestamps: false,
  }
);

Characters.hasMany(Bat_Vehicles, { foreignKey: "character_id" });
Bat_Vehicles.belongsTo(Characters, { foreignKey: "character_id" });

Bat_Vehicles.hasMany(Bat_Vehicles, { foreignKey: "bat_vehicle_id" });
Bat_Vehicles.belongsTo(Bat_Vehicles, { foreignKey: "bat_vehicle_id" });

module.exports = Bat_Vehicles;