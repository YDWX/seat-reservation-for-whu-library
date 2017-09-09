"use strict";

module.exports = function (sequelize, DataTypes) {
  const rule = sequelize.define("rule", {
    disabled: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    preferSeat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mon: DataTypes.STRING,
    tue: DataTypes.STRING,
    wed: DataTypes.STRING,
    thu: DataTypes.STRING,
    fri: DataTypes.STRING,
    sat: DataTypes.STRING,
    sun: DataTypes.STRING,
    effectiveDate: DataTypes.DATE,
    expireDate: DataTypes.DATE,
  });

  rule.associate = function (models) {
    rule.belongsTo(models.user, {
      as: "user"
    })
  }

  return rule;
};