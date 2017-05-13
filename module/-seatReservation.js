var request = require("request");

var SITEBASEURL = "test"

class SeatReservation {
  constructor(userInfo) {
    this.userInfo = userInfo;
    this.token = null;
  }
  login() {
    // return {
    //   option: {
    //     method: "get",
    //     url: SITEBASEURL + '/rest/auth?username=' + this.userInfo.username + "&password=" + this.userInfo.password,
    //   },
    //   callback(result) {
    //     if (result.status == "success") {
    //       this.token = result.data.token;
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    // }
    return SeatReservation.loginTest(this.userInfo.username, this.userInfo.password, (token) => {
      this.token = token;
    });
  }
  static loginTest(username, password, callback) {
    return {
      option: {
        method: "get",
        url: SITEBASEURL + '/rest/auth?username=' + username + "&password=" + password,
      },
      callback(result) {
        if (result.status == "success") {
          callback(result.data.token);
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

module.exports = SeatReservation;