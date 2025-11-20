const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Places = require('./places.model');

const Character_Places = sequelize.define('Character_Places', {
   place_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Places,
        key: "place_id",
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
    tableName: "Character_Places",
    timestamps: false,
  }
);

Characters.hasMany(Character_Places, { foreignKey: "character_id" });
Character_Places.belongsTo(Characters, { foreignKey: "character_id" });

Places.hasMany(Character_Places, { foreignKey: "place_id" });
Character_Places.belongsTo(Places, { foreignKey: "place_id" });

module.exports = Character_Places;