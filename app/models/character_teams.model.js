const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');
const Teams = require('./teams.model');

const Character_Teams = sequelize.define('Character_Teams', {
   team_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Teams,
        key: "team_id",
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
    tableName: "Character_Teams",
    timestamps: false,
  }
);

Characters.hasMany(Character_Teams, { foreignKey: "character_id" });
Character_Teams.belongsTo(Characters, { foreignKey: "character_id" });

Teams.hasMany(Character_Teams, { foreignKey: "team_id" });
Character_Teams.belongsTo(Teams, { foreignKey: "team_id" });

module.exports = Character_Teams;