const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Medias = require('./medias.model');

const Character_Medias = sequelize.define('Character_Medias', {
   media_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Medias,
        key: "media_id",
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
    tableName: "Character_Medias",
    timestamps: false,
  }
);

Characters.hasMany(Character_Medias, { foreignKey: "character_id" });
Character_Medias.belongsTo(Characters, { foreignKey: "character_id" });

Medias.hasMany(Character_Medias, { foreignKey: "media_id" });
Character_Medias.belongsTo(Medias, { foreignKey: "media_id" });

module.exports = Character_Medias;