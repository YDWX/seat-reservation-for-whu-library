const models = require('../models');

class EmailController {
  constructor() {}

  /**
   * 向数据库添加要发送的邮件
   * 
   * @param {any} userId 
   * @param {any} subject 
   * @param {any} text 
   * @param {any} taskId 
   * @returns 
   * @memberof Email
   */
  pushEmail(userId, subject, text, taskId) {
    let opt = {
      userId,
      subject,
      text
    }
    if (taskId) {
      opt.taskId = taskId;
    }
    return models.email.create(opt)
  }

  /**
   * 获取时间点后所有发送失败的邮件
   * 
   * @param {any} afterTime 
   * @returns 
   * @memberof Email
   */
  getFailedEmails(afterTime) {
    return models.email.findAll({
      where: {
        status: false,
        finished: true,
        createdAt: {
          $gt: afterTime
        }
      },
    }).then((emailList) => {
      if (emailList && emailList.length) {
        return emailList;
      } else {
        return null;
      }
    })
  }

  /**
   * 根据id获取email信息
   * 
   * @param {any} id 
   * @returns 
   * @memberof Email
   */
  getEmail(id) {
    return models.email.findById(id, {
      include: [{
        model: models.user,
        as: "targetUser",
      }]
    }).then((emailModel) => {
      if (emailModel) {
        return emailModel.dataValues;
      } else {
        return null;
      }
    })
  }

  /**
   * 完成email发送以后
   * 
   * @param {any} id 
   * @param {any} status 
   * @returns 
   * @memberof Email
   */
  finishEmail(id, status) {
    return models.email.update({
      status,
      finished: true
    }, {
      where: {
        id
      }
    }).then(async (updateArray) => {
      if (!updateArray[0]) {
        return false;
      }
      if(!status) {
        const emailModel = updateArray[0];
        await emailController.pushEmail(emailModel.userId, emailModel.subject, emailModel.text, emailModel.taskId);
      }
      return true;
    })
  }

}

const emailController = new EmailController();
module.exports = emailController;