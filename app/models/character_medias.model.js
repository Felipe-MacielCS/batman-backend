const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Medias = require('./medias.model');

const Medias = sequelize.define('Medias', {
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
    tableName: "Medias",
    timestamps: false,
  }
);

Characters.hasMany(Medias, { foreignKey: "character_id" });
Medias.belongsTo(Characters, { foreignKey: "character_id" });

Medias.hasMany(Medias, { foreignKey: "media_id" });
Medias.belongsTo(Medias, { foreignKey: "media_id" });

module.exports = Medias;