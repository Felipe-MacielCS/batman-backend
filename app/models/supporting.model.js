const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Characters = require('./characters.model');

const Supporting = sequelize.define('Supporting', {
    supporting_id: {
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

    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
  },
  
  {
    tableName: "Supporting",
    timestamps: false,
  }
);

Supporting.belongsTo(Characters, { foreignKey: 'character_id' });
Characters.hasMany(Supporting, { foreignKey: 'character_id' });

module.exports = Supporting;