const _ = require('lodash');

const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');


const userManager = require('./user/userManager');
const seatManager = require('./seat/seatManager');

const queue = require('./queue');

class TaskManager {
  constructor() {}

  async initializeSeatTasks() {
    const userList = await userController.getActiveUsers();
    _.forEach(userList, (userModel) => {
      queue.create('login', {
          userId: userModel.id,
          username: userModel.username,
          password: userModel.password
        })
        .attempts(3)
        .save();
    })
  }

  executeSeatTask(job) {
    return new Promise((resolve, reject) => {

    })
  }

  executeEmailTask(job) {
    return new Promise((resolve, reject) => {
      const {
        to,
        text
      } = job;
    })
  }

  executeLoginTask(job) {
    return new Promise(async(resolve, reject) => {
      const {
        token,
        date,
        seat,
        startTime,
        endTime
      } = job;
      try {
        const bookStatus = seatManager.bookSeat(token, date, seat, startTime, endTime);
        if (bookStatus) {

        } else {

        }
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }

  /**
   * 新用户验证task
   * 
   * @param {any} job 
   * @returns 
   * @memberof TaskManager
   */
  executeVerifyTask(job) {
    return new Promise(async(resolve, reject) => {
      const {
        email,
        username,
        password
      } = job;
      try {
        const token = await userManager.login(username, password);
        if (token) {
          const userModel = await userManager.createUser(email, username, password);
          queue.create('email', {
            to: userModel.email,
            text: ''
          })
        } else {
          queue.create('email', {
            to: userModel.email,
            text: ''
          })
        }
        resolve();
      } catch (e) {
        reject(e)
      }
    })
  }
}

const taskManager = new TaskManager();
module.exports = taskManager;