const Imap = require('imap');
const inspect = require('util').inspect;

const simpleParser = require('mailparser').simpleParser;

const mailConfig = require('../../config/mail.conf');
const mailManager = require('./mailManager');

class MailReceiver {
  constructor(mailAnalysor) {
    this.imap = new Imap({
      user: mailConfig.username,
      password: mailConfig.password,
      host: mailConfig.imap.host,
      port: mailConfig.imap.port,
      tls: true
    });
    this.mailAnalysor = mailAnalysor;
    this._initImap();
  }
  _initImap() {
    const imap = this.imap;
    const mailAnalysor = this.mailAnalysor;
    imap.on('ready', () => {
      // 打开信箱
      imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err;

        // 检测未读邮件
        imap.search(['UNSEEN'], (err, results) => {
          console.log('unseen mail count: ' + results.length);
          if (err) throw err;
          if (results.length === 0) {
            imap.destroy();
            return;
          }
          // 获取邮件
          const f = imap.fetch(results, {
            bodies: ''
          });

          f.on('message', (msg, seqno) => {
            msg.on('body', (stream, info) => {
              let buffer = '';
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', () => {
                simpleParser(buffer, (err, mail) => {
                  if (err) throw err;
                  mailAnalysor(mail.from.value[0].address, mail.subject, mail.text);
                })
              });
            });
          });

          f.once('error', (err) => {
            console.log('Fetch error: ' + err);
          });
          f.once('end', () => {
            console.log('Done fetching all messages!');
          });

          // 设置已读标记
          imap.setFlags(results, "SEEN", function (err) {
            if (err) {
              console.log("Set flags error:" + err);
            }
            console.log("set flags finished");
          });
          imap.end();
        });
      });
    });

    imap.on('error', (err) => {
      console.log(err);
    });

    imap.on('end', () => {
      console.log('Connection ended');
    });

    imap.on('close', (hasError) => {
      console.log("Connection complete close");
    });
  }
  execute() {
    this.imap.connect();
  }
}

module.exports = MailReceiver;