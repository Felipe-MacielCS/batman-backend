const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Bat_Equipments = require('./bat_equipments.model');

const Bat_Equipments = sequelize.define('Bat_Equipments', {
   bat_equipment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Bat_Equipments,
        key: "bat_equipment_id",
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
    tableName: "Bat_Equipments",
    timestamps: false,
  }
);

Characters.hasMany(Bat_Equipments, { foreignKey: "character_id" });
Bat_Equipments.belongsTo(Characters, { foreignKey: "character_id" });

Bat_Equipments.hasMany(Bat_Equipments, { foreignKey: "bat_equipment_id" });
Bat_Equipments.belongsTo(Bat_Equipments, { foreignKey: "bat_equipment_id" });

module.exports = Bat_Equipments;