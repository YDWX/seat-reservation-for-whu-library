const schedule = require('node-schedule');
const kue = require('kue'),
  queue = kue.createQueue();

const models = require("../models");

// var SeatReservation = require("./seatReservation.js");
const MailReceiver = require("./mail/mailReceiver");
// var MailSender = require("./mailSender.js");

class TaskHandler {
  constructor() {

    this.mailSchedule = null;
    this.seatSchedule = null;

    // this.mailSender = new MailSender();
    this.mailReceiver = new MailReceiver();
    // this.seatReservation = new SeatReservation();
  }
  start() {
    /**
     * 每一分钟检测一次邮件
     */
    // this.mailSchedule = schedule.scheduleJob('*/1 * * * *', () => {
    this.mailReceiver.execute();
    // });

    /**
     * 每天晚上10点25开始执行抢座前的等待
     */
    // this.seatSchedule = schedule.scheduleJob("25 22 * * *", function(){
    //   this.seatReservation.execute();
    // });

    // this.mailSender.send("635020058@qq.com", "实验邮件", "没有内容");
  }
  stop() {
    this.mailSchedule.cancel();
    this.seatSchedule.cancel();
    models.sequelize.close();
  }
}

module.exports = new TaskHandler();