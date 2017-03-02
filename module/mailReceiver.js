var Imap = require('imap'),
  inspect = require('util').inspect;
const emailConfig = require('../config/email.conf');

class MailReceiver {
  constructor() {
    this.imap = new Imap({
      user: emailConfig.username,
      password: emailConfig.password,
      host: emailConfig.imap.host,
      port: emailConfig.imap.port,
      tls: true
    });
    this._initImap(this.imap);

  }
  _initImap() {
    var imap = this.imap;
    imap.on('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err;
        imap.search(['UNSEEN'], (err, results) => {
          console.log('unseen mail count: ' + results.length);
          if (err) throw err;
          if (results.length === 0) {
            imap.end();
            return;
          }

          var f = imap.fetch(results, {
            bodies: 'HEADER.FIELDS (FROM SUBJECT)'
          });

          f.on('message', (msg, seqno) => {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', (stream, info) => {
              var buffer = '';
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', () => {
                console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
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
            imap.end();
          });

          var s = imap.setFlags(results, "SEEN", function (err) {
            if (err) {
              console.log("Set flags error:" + err);
            }
          })
        });
      });
    });

    imap.on('error', (err) => {
      console.log(err);
    });

    imap.on('end', () => {
      console.log('Connection ended');
    });

    imap.once('close', (hasError) => {
      console.log("Connection complete close");
    });
  }
  execute() {
    this.imap.connect();
  }
}

module.exports = MailReceiver;