const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');

const Character_Aliases = sequelize.define('Character_Aliases', {
    alias_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Characters,
        key: 'character_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    alias_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
  },
  
  {
    tableName: "Character_Aliases",
    timestamps: false,
  }
);

Character_Aliases.belongsTo(Characters, { foreignKey: 'character_id' });
Characters.hasMany(Character_Aliases, { foreignKey: 'character_id' });

module.exports = Character_Aliases;