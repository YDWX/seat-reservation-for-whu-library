const userController = require('../../controllers/userController');
const ruleController = require('../../controllers/ruleController');
const mailSender = require('./mailSender');
// 邮件格式
// 注册邮件格式——register
// {
//     "username":"2014302580001",
//     "password":"balabala",
// }
// 选座邮件格式——choose
// const text = {
//     "preferSeat":"[6028,6029,6030]",
//     "mon":"8 30 21 30",
//     "tue": "",
//     "wed": "",
//     "thu": "",
//     "fri": "",
//     "sat": "",
//     "sun": "",
//     "effectiveDate": "",//从xx日期开始
//     "expireDate": "",//到xx日期结束
// }
class mailAnalysor {
  constructor() {}

  analyse(mailobject) {
    const {
      email,
      subject,
      text
    } = mailobject;
    const contentJson = JSON.parse(text);
    if (subject === 'register') {
      userController.createUser(email, contentJson.username, contentJson.password).then((user) => {
        //TODO: 注册失败错误处理
      });
    } else if (subject === 'choose') { //提交选座信息
      userController.checkUserExist(email).then((user) => {
        if (!user) {
          //邮件提示先注册
          mailSender.send(email, '注册提醒', '请先发送注册邮件注册用户，再发送预约座位邮件');
          return;
        }
        //后面两个参数在text一起
        ruleController.createRule(user.id, contentJson, null, null).then((rule) => {
          //TODO: 添加选座失败错误处理

        });
      })
    } else if (subject === 'change') { //修改学号密码

    }
  }
}

module.exports = new mailAnalysor();