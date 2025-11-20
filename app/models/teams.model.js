const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Teams = sequelize.define('Teams', {
    teams_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
  },
  
  {
    tableName: "Teams",
    timestamps: false,
  }
);

module.exports = Teams;