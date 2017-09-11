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
          return data.data.token;
        } else {
          return null;
        }
      })
  }

}

const userManager = new UserManager();
module.exports = userManager;