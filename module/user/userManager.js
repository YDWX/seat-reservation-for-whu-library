var autoIncrement = require('mongoose-auto-increment'); //自增ID 模块

var db = require("./db.js");

var Schema = db.Schema;

autoIncrement.initialize(db);
var userSchema = new Schema({
  email: String,
  status: {
    type: Number,
    default: 0
  }, // 用户状态：0正常，1禁用
  signupTime: {
    type: Date,
    default: Date.now
  },
  reservation: {
    account: {
      username: String,
      password: String
    },
    rule: {
      preferSeat: Array,
      day: {
        type: Array,
        default: new Array(7)
      },
      // {
      //   status: Boolean,
      //   preferSeat: Array,
      //   startTime: Number,
      //   endTime: Number
      // },
    },
    temp: {
      dirty: {
        type: Boolean,
        default: false
      },
      status: Boolean,
      preferSeat: Array,
      startTime: Number,
      endTime: Number
    },
    count: {
      type: Number,
      default: 0
    },
  }
});
userSchema.plugin(autoIncrement.plugin, {
  model: "user",
  field: "id"
});

var userModel = db.model("user", userSchema);

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