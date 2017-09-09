"use strict";

module.exports = function (sequelize, DataTypes) {
  const email = sequelize.define("email", {
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: DataTypes.TEXT,
    status: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    finished: {
      type: DataTypes.BOOLEAN,
      default: false
    },
  });

  email.associate = function (models) {
    email.belongsTo(models.user, {
      as: "targetUser",
      foreignKey: {
        allowNull: false
      }
    })
    email.belongsTo(models.task, {
      as: "targetTask"
    })
  }

  return email;
};