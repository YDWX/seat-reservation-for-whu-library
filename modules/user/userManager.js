const seatApi = require('../seatApi');
const date = require('../Date');
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

  getStartTime(token) {
    return seatApi.GET_STARTTIME(token)
      .then(({
        data
      }) => {
        if (data.status == "success") {
          if (data.data.dates.indexOf(date.prototype.getAnyDay(1)) != -1) {
            return true;
          } else {
            return false;
          }
        }
      })
  }
}

const userManager = new UserManager();
module.exports = userManager;