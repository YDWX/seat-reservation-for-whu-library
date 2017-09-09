const Imap = require('imap');
const inspect = require('util').inspect;

const simpleParser = require('mailparser').simpleParser;

const mailConfig = require('../../config/mail.conf');
const MailAnalysor = require('./mailAnalysor');

class MailReceiver {
  constructor() {
    this.imap = new Imap({
      user: mailConfig.username,
      password: mailConfig.password,
      host: mailConfig.imap.host,
      port: mailConfig.imap.port,
      tls: true
    });
    // this.mailAnalysor = new MailReceiver();
    this._initImap();
  }
  _initImap() {
    const imap = this.imap;
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
            console.log('Message #%d', seqno);
            const prefix = '(#' + seqno + ') ';
            msg.on('body', (stream, info) => {
              // if (info.which === 'TEXT')
              //   console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
              let buffer = '',
                count = 0;
              stream.on('data', (chunk) => {
                count += chunk.length;
                buffer += chunk.toString('utf8');
                // if (info.which === 'TEXT')
                //   console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
              });
              stream.once('end', () => {
                // console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                // if (info.which !== 'TEXT')
                //   {console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));}
                // else
                //   {
                simpleParser(buffer, (err, mail) => {
                  console.log(mail.text);
                })
                //   console.log(prefix + 'Body [%s] Finished', inspect(info.which));}
              });
            });
            msg.once('end', () => {
              console.log(prefix + 'Finished');
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