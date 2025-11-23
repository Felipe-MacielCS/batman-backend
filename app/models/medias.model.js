const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Medias = sequelize.define('Medias', {
    media_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    release_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1939
        }
    },

    creator: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
  },
  
  {
    tableName: "Medias",
    timestamps: false,
  }
);

module.exports = Medias;