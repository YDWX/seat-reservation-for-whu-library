const _ = require('lodash');
const models = require('../models');

class RuleController {
  constructor() {}

  createRule(userId, rule, effectiveDate, expireDate) {
    let opt = Object.assign({
      userId,
      effectiveDate,
      expireDate
    }, rule)
    return models.rule.create(opt);
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
        // disabled: false, //QA:
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
      return ruleController.computeRules(ruleList);
    })
  }

  computeRules(ruleList) {
    let reduceRule = {}
    _.forEach(ruleList, (ruleModel) => {
      reduceRule = Object.assign(reduceRule, ruleModel);
    })
    //QA:
    const resultRule = reduceRule.dataValues;
    let computedRule = {
      mon: resultRule.mon,
      tue: resultRule.tue,
      wed: resultRule.wed,
      thu: resultRule.thu,
      fri: resultRule.fri,
      sat: resultRule.sat,
      sun: resultRule.sun,
      preferSeat: resultRule.preferSeat
    }
    return computedRule;
  }
}
const ruleController = new RuleController();
module.exports = ruleController;