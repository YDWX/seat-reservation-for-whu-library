const queue = require('./queue');
const _ = require('lodash');
const userController = require('../controllers/userController');
class seatReservation{
  constructor(){

  }
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
  execute(){
    this.initializeSeatTasks();
  }
}
module.exports = new seatReservation();