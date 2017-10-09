const userController = require('../../controllers/userController');
const ruleController = require('../../controllers/ruleController');
// 邮件格式
// const text = {
//     username:2014302580001,
//     password:'balabala',
// }
// const text = {
//     preferSeat:6028,
//     mon:'8 30 21 30',
//     tue: '',
//     wed: '',
//     thu: '',
//     fri: '',
//     sat: '',
//     sun: '',
//     effectiveDate: '',//从xx日期开始
//     expireDate: '',//到xx日期结束
// }
class mailAnalysor {
  constructor() {}

  analyse(mailobject) {
    const {
      email,
      subject,
      text
    } = mailobject;
    text = JSON.parse(text);
    if (subject === '注册') {
      userController.checkUserExist(email).then((user) => {
        if (user) {
          //TODO: 发送邮件提示已经注册过
          return;
        }

        userController.createUser(email, text.username, text.password).then((user) => {
          //TODO: 注册失败错误处理
        });
      })
    } else if (subject === '选座') {
      userController.checkUserExist(email).then((user) => {
        if (!user) {
          //TODO: 邮件提示先注册
          return;
        }
        //后面两个参数在text一起
        ruleController.createRule(user.id, text, null, null).then((rule) => {
          //TODO: 添加选座失败错误处理
        });
      })
    } else {

    }
  }
}