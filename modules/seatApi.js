const axios = require('axios');
const qs = require('qs');

axios.defaults.baseURL = 'http://seat.lib.whu.edu.cn/rest';

module.exports = {
  /**
   * 登录
   * 
   * @param {any} username 
   * @param {any} password 
   * @returns 
   */
  LOGIN(username, password) {
    return axios.post('/auth', qs.stringify({
      username,
      password
    }))
  },

  /**
   * 获取预约信息，可以用于判断token是否失效
   * 
   * @param {any} token 
   * @returns 
   */
  GET_RESERVATION(token) {
    return axios.get(`/v2/user/reservations?token=${token}`)
  },

  /**
   * 提交选座信息
   * 
   * @param {any} token 
   * @param {any} date 
   * @param {any} seat 
   * @param {any} startTime 
   * @param {any} endTime 
   * @returns 
   */
  POST_RESERVATION(token, date, seat, startTime, endTime) {
    return axios.post('/v2/freeBook', qs.stringify({
      date,
      seat,
      startTime,
      endTime,
      token
    }))
  },
  // {
  //   "status": "success",
  //   "data": {
  //     "buildings": [
  //       [1, "信息科学分馆", 5],
  //     ],
  //     "rooms": [
  //       [4, "一楼3C创客空间", 1, 1],
  //     ],
  //     "hours": 14,
  //     "dates": ["2017-10-12"]
  //   },
  //   "message": "",
  //   "code": "0"
  // }

  GET_STARTTIME(token){
    return axios.post('/v2/free/filters', qs.stringify({
      token,
    }))
  }
}