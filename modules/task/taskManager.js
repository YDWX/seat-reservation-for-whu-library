const taskController = require('../../controllers/taskController');
const userController = require('../../controllers/userController');

const queue = require('../queue');

class TaskManager {
  constructor() {}

  async initializeSeatTasks() {
    const userList = await userController.getActiveUsers();
    if (userList) {

    }
  }

  executeSeatTask(job) {
    return new Promise((resolve, reject) => {

    })
  }

  executeEmailTask(job) {
    return new Promise((resolve, reject) => {

    })
  }

  executeLoginTask(job) {
    return new Promise((resolve, reject) => {

    })
  }
}

const taskManager = new TaskManager();
module.exports = taskManager;