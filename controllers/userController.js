const _ = require('lodash')
const models = require('../models');
const ruleController = require('../controllers/ruleController')

class UserController {
  constructor() {}

  createUser(email, username, password) {
    return models.user.findOrCreate({
      where: {
        email
      },
      defaults: {
        username,
        password,
        disabled:false, 
        status:true
      }
    }).spread((userModel, created) => {
      if (created) {
        return userModel.dataValues;
      } else {
        return null;
      }
    })
  }

  changeAccount(email, username, password) {
    return models.user.update({
      username,
      password
    }, {
      where: {
        email
      }
    }).then((updateArray) => {
      if (!updateArray[0]) {
        return false;
      }
      return true;
    })
  }

  disableUser(email, disableStatus = true) {
    return models.user.update({
      disabled: disableStatus
    }, {
      where: {
        email
      }
    }).then((updateArray) => {
      if (!updateArray[0]) {
        return false;
      }
      return true;
    })
  }

  saveToken(id, token) {
    return models.user.update({
      token,
      lastLogin: Date.now(),
      status: true
    }, {
      where: {
        id
      }
    }).then((updateArray) => {
      if (!updateArray[0]) {
        return false;
      }
      return true;
    })
  }

  setStatus(id, status) {
    return models.user.update({
      status
    }, {
      where: {
        id
      }
    }).then((updateArray) => {
      if (!updateArray[0]) {
        return false;
      }
      return true;
    })
  }

  getActiveUsers() {
    return models.user.findAll({
      where: {
        disabled: false,
        status: true
      },
      include: [{
        model: models.rule,
        as: "rules"
      }]
    }).then((userList) => {
      if (userList && userList.length) {
        userList = _.map(userList, (userModel) => {
          userModel.computedRule = ruleController.computeRules(userModel.rules);
          return userModel;
        }).filter((userModel) => {
          if (userModel.computedRule && JSON.parse(userModel.computedRule.preferSeat).length) {
            return true;
          }
          return false;
        })
        return userList;
      }
      return null;
    })
  }
  // 检查用户是否已存在
  checkUserExist(email){
    return models.user.findOne({
      where:{
        email:email,
      }
    }).then((user)=>{
      return user;
    })
  }
  



}

const userController = new UserController();
module.exports = userController;