const models = require('../models');

class RuleController {
  constructor() {}

  createRule(userId, rule, effectiveDate, expireDate) {
    let opt = Object.assign({
      userId,
      effectiveDate,
      expireDate
    }, rule)
    return models.rule.create(opt)
  }

  disableRules(userId, disableStatus = true) {
    return models.rule.update({
      disabled: disableStatus
    }, {
      where: {
        userId
      }
    }).then((updateArray) => {
      if (!updateArray[0]) {
        return false;
      }
      return true;
    })
  }

  getComputedRule(userId) {
    const now = new Date();
    return models.rule.findAll({
      where: {
        userId,
        disabled: true,
        effectiveDate: {
          $lte: now
        },
        expireDate: {
          $gte: now
        }
      },
      include: [{
        model: models.user,
        as: "user"
      }],
      order: [
        ['createdAt', 'ASC']
      ]
    }).then((ruleList) => {
      let reduceRule = {}
      ruleList.forEach((ruleModel) => {
        reduceRule = Object.assign(reduceRule, ruleModel);
      })
      let computedRule = {
        mon: reduceRule.mon,
        tue: reduceRule.tue,
        wed: reduceRule.wed,
        thu: reduceRule.thu,
        fri: reduceRule.fri,
        sat: reduceRule.sat,
        sun: reduceRule.sun,
        preferSeat: reduceRule.preferSeat
      }
      return computedRule;
    })
  }
}
const ruleController = new RuleController();
module.exports = ruleController;