const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Characters = sequelize.define('Characters', {
    character_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    real_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },


    first_appearance: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    created_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    skills: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },

    isVillain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    isAntiHero: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  
  {
    tableName: "Characters",
    indexes: [
      {
        fields: ['name'] // Index per name
      }
    ]
  }
);

module.exports = Characters;