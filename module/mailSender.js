const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.conf');

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      secure: true,
      port: emailConfig.smtp.port,
      pool: true,
      auth: {
        user: emailConfig.username,
        pass: emailConfig.password
      }
    }, {
      // Default options for the message. Used if specific values are not set
      from: emailConfig.nickname + " <" + emailConfig.username + ">"
    });
  }
  send(target, subject, html) {
    // setup email data with unicode symbols
    var mailOptions = {
      to: target, // list of receivers
      subject: subject, // Subject line
      html: html // html body
    };
    // send mail with defined transport object
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: " + info.response);
      }
    });
  }

}

module.exports = MailSender;