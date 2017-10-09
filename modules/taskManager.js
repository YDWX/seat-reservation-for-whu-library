const _ = require('lodash');
const log4js = require("log4js");
const logger = log4js.getLogger();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');
const ruleController = require('../controllers/ruleController');

const userManager = require('./user/userManager');
const seatManager = require('./seat/seatManager');

const queue = require('queue');
class TaskManager {
  constructor() {}

  executeSeatTask(job) {
    return new Promise((resolve, reject) => {
      //TODO:
      const {
        token,
        date,
        seat,
        startTime,
        endTime
      } = job;
      try {
        const bookStatus = seatManager.bookSeat(token, date, seat, startTime, endTime);
        //TODO:
        if (bookStatus) {
          logger.debug("book seat success date:[%d] from:[%d] to:[%d]",date, startTime, endTime);
        } else {
          //失败重新添加到任务队列
          
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }

  executeEmailTask(job) {
    return new Promise((resolve, reject) => {
      const {
        to,
        text
      } = job;
      //TODO:
    })
  }

  executeLoginTask(job) {
    return new Promise(async(resolve, reject) => {
      const {id, username, password} = job;
      try{
        const token = userManager.login(username, password);
        //TODO:结果处理,登录成功后创建seat任务开始抢座
        if(token){
          logger.debug("login success user:[%s]", username);
          userController.saveToken(id, token);
          // 根据userid查询当前用户的抢座任务（用户通过邮件创建的）
          ruleController.getComputedRule(id).then(function(rule){
            const during = rule[(new Date()).toString().slice(0, 3).toLowerCase()];
            if(rule[during]){
              const [startHour, startMin, endHour, endMin] = during.split(' ').map((item)=>{return parseInt(item)});
              queue.create('seat',{
                token,
                date: new Date(),
                seat:rule.preferSeat,
                startTime:startHour*60+startMin,
                endTime:endHour*60+endMin
              })
            }
          });
        }else{
          logger.debug("login failed user:[%s]", username);
        }
      }catch(e){
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