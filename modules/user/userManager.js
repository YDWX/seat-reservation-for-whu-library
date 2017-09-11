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
    try {
      const token = await userManager.login(username, password);
      if (token) {
        const userModel = await userController.createUser(email, username, password);
        await userController.saveToken(userModel.id, token);
      } else {
        // 账号或密码错误
      }
    } catch (e) {

    }
  }

  login(username, password) {
    return seatApi.LOGIN(username, password)
      .then(({
        data
      }) => {
        if (data.status == 'success') {
          return data.data.token;
        } else {
          return null;
        }
      })
  }



}

const userManager = new UserManager();
module.exports = userManager;