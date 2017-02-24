const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.sina.com",
      secure: true,
      port: 465,
      pool: true,
      auth: {
        user: 'seatreservation@sina.com',
        pass: 'Lu5y)E5pj=bQbf'
      }
    }, {
      // Default options for the message. Used if specific values are not set
      from: 'seatreservation <seatreservation@sina.com>'
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