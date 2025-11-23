const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Bat_Equipments = require('./bat_equipments.model');

const Character_Bat_Equipments = sequelize.define('Character_Bat_Equipments', {
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
    tableName: "Character_Bat_Equipments",
    timestamps: false,
  }
);

Characters.hasMany(Character_Bat_Equipments, { foreignKey: "character_id" });
Character_Bat_Equipments.belongsTo(Characters, { foreignKey: "character_id" });

Bat_Equipments.hasMany(Character_Bat_Equipments, { foreignKey: "bat_equipment_id" });
Character_Bat_Equipments.belongsTo(Bat_Equipments, { foreignKey: "bat_equipment_id" });

module.exports = Character_Bat_Equipments;