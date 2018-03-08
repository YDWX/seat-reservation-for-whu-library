const kue = require('kue');
const queue = kue.createQueue();

const log4js = require("log4js");
const logger = log4js.getLogger();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');
const ruleController = require('../controllers/ruleController');

const userManager = require('./user/userManager');
const seatManager = require('./seat/seatManager');

const mailSender = require('./mail/mailSender');

const date = require('./Date');

let tokenForBootstrapCount = 1;


const createSeatJob = (queue, seatDetail) => {
  queue.create('seat', seatDetail)
    .attempts(3)
    .save();
}

class TaskManager {
  constructor() {}

  executeSeatTask(job, done) {
    return new Promise(async (resolve, reject) => {
      const {
        token,
        date,
        seats,
        seat,
        startTime,
        endTime
      } = job.data;
      try {
        const bookStatus = await seatManager.bookSeat(token, date, seat, startTime, endTime);
        if (bookStatus) {
          logger.debug("book seat success date:[%d] from:[%d] to:[%d] seat:[%d]", date, startTime, endTime, seat);
          done();
          return;
        }
        logger.debug("book seat fail date:[%d] from:[%d] to:[%d] seat:[%d]", date, startTime, endTime, seat);
        //如果抢座失败且preferseat数组中还有其他座位则继续创建抢座任务
        if (seats.length >= 2) {
          seats.shift();
          let seatDetail = {
            token,
            date,
            seats,
            seat: seats[0],
            startTime,
            endTime
          };
          createSeatJob(queue, seatDetail);
        } else {
          //TODO:发送今天抢座失败邮件
        }
        done(new Error("fail"));
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }

  executeEmailTask(job, done) {
    return new Promise((resolve, reject) => {
      const {
        to,
        text
      } = job.data;
      new mailSender().send(to, "图书馆座位预约", text);
    })
  }

  executeLoginTask(job, done) {
    return new Promise((resolve, reject) => {
      const {
        userId,
        username,
        password
      } = job.data;
      try {
        const tokenPromise = userManager.login(username, password);
        tokenPromise.then(async (token) => {
          if (token) {
            logger.debug("login success user:[%s]", username);
            await userController.saveToken(userId, token);
            //在这里登陆成功要创建 SeatBootstrap 任务检测是否到开始选座的时间，检测没到时间要继续创建该任务执行，直到检测到了时间才能 process seat task
            if (tokenForBootstrapCount) {
              queue.create("seatBootstrap", {
                  token
                })
                .attempts(1000)
                .backoff({
                  delay: 5 * 1000,
                  type: 'fixed'
                })
                .save();
              tokenForBootstrapCount--;
            }
            // 根据userid查询当前用户的抢座任务（用户通过邮件创建的）
            ruleController.getComputedRule(userId).then(function (rule) {
              const during = rule[(new Date()).toString().slice(0, 3).toLowerCase()];
              if (!during) {
                return;
              }
              const [startHour, startMin, endHour, endMin] = during.split(' ').map((item) => {
                return parseInt(item);
              });
              const seatDetail = {
                token,
                date: date.prototype.getAnyDay(1).Format('yyyy-MM-dd'),
                seats: JSON.parse(rule.preferSeat), //传入选座数组，里面有多个座位，从第一个座位开始请求，如果成功那么发送成功邮件，如果失败继续选第二个座位，以此类推
                seat: JSON.parse(rule.preferSeat)[0],
                startTime: startHour * 60 + startMin,
                endTime: endHour * 60 + endMin
              }
              createSeatJob(queue, seatDetail);
            });
            done();
          } else {
            logger.debug("login failed user:[%s]", username);
            done(new Error("login fail"));
          }
        })

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
  executeVerifyTask(job, done) {
    return new Promise(async (resolve, reject) => {
      const {
        email,
        username,
        password
      } = job.data;
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

  executeSeatBootstrapTask(job, done) {
    return new Promise(async (resolve, reject) => {
      const {
        token
      } = job.data;
      try {
        if (!token) {
          reject("no token");
        }
        userManager.getStartTime(token).then((data) => {
          if (data) {
            /**因为登录成功后可能还没到抢座开始时间，
             * 所以需要检测能否开始抢座，可以之后再处理“seat”类任务
             * 没有采用推迟queue.create 推迟创建任务的方式，而是推迟process */
            queue.process('seat', 15, async (job, done) => {
              try {
                await taskManager.executeSeatTask(job, done);
              } catch (e) {

              }
            });
            done();
            resolve();
            return;
          }
          done(new Error('fail'));

        })
      } catch (e) {
        reject(e);
      }
    })
  }
}

const taskManager = new TaskManager();

// queue.process('seat', 15, async (job, done) => {
//   try {
//     await taskManager.executeSeatTask(job);
//   } catch (e) {

//   }
//   done();
// })

queue.process('email', async (job, ctx, done) => {
  try {
    await taskManager.executeEmailTask(job, done);
  } catch (e) {

  }
})

/**
 * 检测新一天的抢座时候开启
 */
queue.process('seatBootstrap', async (job, done) => {
  try {
    await taskManager.executeSeatBootstrapTask(job, done);
  } catch (e) {

  }
})

/**
 * 抢座的登陆
 */
queue.process('login', 15, async (job, done) => {
  try {
    await taskManager.executeLoginTask(job, done);
  } catch (e) {

  }
})

/**
 * 创建账号的验证
 */
queue.process('verify', 15, async (job, done) => {
  try {
    await taskManager.executeVerifyTask(job, done);
  } catch (e) {

  }
})

module.exports = queue;