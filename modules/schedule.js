const schedule = require('node-schedule');

const models = require("../models");

const seatReservation = require("./seatReservation.js");
const mailReceiver = require("./mail/mailReceiver");
// var mailSender = require("./mailSender.js");

class Schedule {
  constructor() {

    this.mailSchedule = null;
    this.seatSchedule = null;
    this.seatReservation = seatReservation;
  }
  start() {
    /**
     * 每一分钟检测一次邮件
     */
    // this.mailSchedule = schedule.scheduleJob('*/1 * * * *', () => {
    mailReceiver.execute();
    // });

    /**
     * 每天晚上10点25开始执行抢座前的等待
     */
    this.seatSchedule = schedule.scheduleJob("10 22 * * *", function () {
      this.seatReservation.execute();
    });

    // this.mailSender.send("635020058@qq.com", "实验邮件", "没有内容");
  }
  stop() {
    mailSchedule.cancel();
    seatSchedule.cancel();
    models.sequelize.close();
  }
}

module.exports = new Schedule();