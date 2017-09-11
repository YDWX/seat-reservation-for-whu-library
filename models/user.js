"use strict";

module.exports = function (sequelize, DataTypes) {
  const user = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    notification: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    token: DataTypes.STRING,
    lastLogin: DataTypes.DATE
  });

  user.associate = function (models) {
    user.hasMany(models.rule, {
      as: "rules"
    })
    user.hasMany(models.task, {
      as: "tasks"
    })
    user.hasMany(models.email, {
      as: "emails"
    })
  }

  return user;
};