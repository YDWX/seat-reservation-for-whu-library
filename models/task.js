"use strict";

module.exports = function (sequelize, DataTypes) {
  const task = sequelize.define("task", {
    seat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    endTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    finished: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    taskTime: DataTypes.DATE,
    taskType: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'seat'
    }
  });

  task.associate = function (models) {
    task.belongsTo(models.user, {
      as: "user"
    })
  }

  return task;
};