"use strict";

module.exports = function (sequelize, DataTypes) {
  const task = sequelize.define("task", {
    seat:  DataTypes.INTEGER,
    startTime: DataTypes.INTEGER,
    endTime: DataTypes.INTEGER,
    status: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    finished: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    taskType: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'seat'
    }
  });
  //table task add foreign key user
  task.associate = function (models) {
    task.belongsTo(models.user, {
      as: "user"
    })
  }

  return task;
};