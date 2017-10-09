const kue = require('kue');
const queue = kue.createQueue();

const taskManager = require('./taskManager')

// queue.process('seat', 15, async (job, done) => {
//   try {
//     await taskManager.executeSeatTask(job);
//   } catch (e) {

//   }
//   done();
// })

queue.process('email', async (job, ctx, done) => {
  try {
    await taskManager.executeEmailTask(job);
  } catch (e) {

  }
  done();
})

/**
 * 检测新一天的抢座时候开启
 */
queue.process('seatBootstrap', async (job, done) => {
  /**因为登录成功后可能还没到抢座开始时间，
   * 所以需要检测能否开始抢座，可以之后再处理“seat”类任务
   * 没有采用推迟queue.create 推迟创建任务的方式，而是推迟process */
  queue.process('seat', 15, async (job, done) => {
    try {
      await taskManager.executeSeatTask(job);
    } catch (e) {
  
    }
    done();
  })
})

/**
 * 抢座的登陆
 */
queue.process('login', 15, async (job, done) => {
  try {
    await taskManager.executeLoginTask(job);
  } catch (e) {

  }
  done();
})

/**
 * 创建账号的验证
 */
queue.process('verify', 15, async (job, done) => {
  try {
    await taskManager.executeVerifyTask(job);
  } catch (e) {

  }
  done();
})

module.exports = queue;