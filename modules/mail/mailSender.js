const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail.conf');

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: mailConfig.smtp.host,
      secure: true,
      port: mailConfig.smtp.port,
      pool: true,
      auth: {
        user: mailConfig.username,
        pass: mailConfig.password
      }
    }, {
      // Default options for the message. Used if specific values are not set
      from: mailConfig.nickname + " <" + mailConfig.username + ">"
    });
  }
  
  send(target, subject, html) {
    // setup email data with unicode symbols
    const mailOptions = {
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