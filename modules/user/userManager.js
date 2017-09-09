

class UserManager {
  constructor() {

  }
  /**
   * 新邮箱注册
   * 
   * @param {String} email 
   * @param {Object} account
   * @param {Object} rule 
   * @param {Function} callback 
   * 
   * @memberOf UserManager
   */
  signup(email, account, rule, callback) {
    userModel.findOne({
      email: email
    }, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      if (res) {
        callback(null, false, "用户已存在");
        return;
      }
      var data = {
        email: email
      };
      if (rule) {
        data.reservation = {
          account: account,
          rule: rule
        }
      }
      var entity = new userModel(data);
      entity.save((err, fluffy) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, true);
      })
    });
  }
  /**
   * 修改reservation
   * 
   * @param {String} email 
   * @param {String} option 
   * @param {any} data 
   * @param {Function} callback 
   * @returns 
   * 
   * @memberOf UserManager
   */
  setReservation(email, option, data, callback) {
    if (!option) {
      callback(null, false, "没有指定修改项目");
      return;
    }
    userModel.findOne({
      email: email
    }, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      if (!res) {
        callback(null, false, "用户不存在");
        return;
      }
      var data = {};
      data[option] = data;
      var update = {
        $set: {
          reservation: data
        }
      }
      userModel.update({
        email: email
      }, update, (err, fluffy) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, true);
      })
    });
  }
  getUserInfo(email, condition, callback) {
    userModel.find(condition, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      if (!res) {
        callback(null, false, "没有用户信息");
        return;
      }
      callback(null, true, "success", res);
    });
  }
}

module.exports = UserManager;