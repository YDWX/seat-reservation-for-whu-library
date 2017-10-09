const userController = require('../../controllers/userController');
const seatApi = require('../seatApi');

class UserManager {
  constructor() {

  }
  /**
   * 新邮箱注册
   * 
   * @param {String} email 
   * 
   * @memberOf UserManager
   */
  async createUser(email, username, password) {
    const userModel = await userController.createUser(email, username, password);
  }

  login(username, password) {
    return seatApi.LOGIN(username, password)
      .then(({
        data
      }) => {
        if (data.status == 'success') {
          //TODO:登录成功需要修改数据库user的token字段
          userController.saveToken(,data.data.token)
          return data.data.token;
        } else {
          return null;
        }
      })
  }

}

const userManager = new UserManager();
module.exports = userManager;