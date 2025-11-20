const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Bat_Weapons = require('./bat_weapons.model');

const Bat_Weapons = sequelize.define('Bat_Weapons', {
   bat_weapon_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Bat_Weapons,
        key: "bat_weapon_id",
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
    tableName: "Bat_Weapons",
    timestamps: false,
  }
);

Characters.hasMany(Bat_Weapons, { foreignKey: "character_id" });
Bat_Weapons.belongsTo(Characters, { foreignKey: "character_id" });

Bat_Weapons.hasMany(Bat_Weapons, { foreignKey: "bat_weapon_id" });
Bat_Weapons.belongsTo(Bat_Weapons, { foreignKey: "bat_weapon_id" });

module.exports = Bat_Weapons;