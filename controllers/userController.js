const models = require('../models');

class UserController {
  constructor() {}

  createUser(email, username, password) {
    return models.user.findOrCreate({
      where: {
        email
      },
      defaults: {
        username,
        password
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




}

const userController = new UserController();
module.exports = userController;