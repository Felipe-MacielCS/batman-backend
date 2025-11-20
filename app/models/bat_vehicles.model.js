const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Bat_Vehicles = sequelize.define('Bat_Vehicles', {
    bat_vehicle_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    range: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
  },
  
  {
    tableName: "Bat_Vehicles",
    timestamps: false,
  }
);

module.exports = Bat_Vehicles;