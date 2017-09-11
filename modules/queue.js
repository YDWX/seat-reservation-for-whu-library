const kue = require('kue');
const queue = kue.createQueue();

const taskManager = require('./task/taskManager')

//seat
//gettoken
//email

queue.process('seat', 15, (job, done) => {
  try {
    await taskManager.executeSeatTask(job);
  } catch (e) {

  }
  done();
})

queue.process('email', (job, ctx, done) => {
  try {
    await taskManager.executeEmailTask(job);
  } catch (e) {

  }
  done();
})

queue.process('login', 15, (job, done) => {
  try {
    await taskManager.executeLoginTask(job);
  } catch (e) {

  }
  done();
})

module.exports = queue;