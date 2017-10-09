const queue = require('queue');
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
    initializeSeatTasks();
  }
}
module.exports = new seatReservation();