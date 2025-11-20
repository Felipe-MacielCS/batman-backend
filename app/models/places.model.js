const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Places = sequelize.define('Places', {
    place_id: {
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
    tableName: "Places",
    timestamps: false,
  }
);

module.exports = Places;