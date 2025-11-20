const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');

const Bat_Family = sequelize.define('Bat_Family', {
    bat_family_id: {
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

    relationship: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
  },
  
  {
    tableName: "Bat_Family",
    timestamps: false,
  }
);

Bat_Family.belongsTo(Characters, { foreignKey: 'character_id' });
Characters.hasMany(Bat_Family, { foreignKey: 'character_id' });

module.exports = Bat_Family;