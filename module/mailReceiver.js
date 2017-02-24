var Imap = require('imap'),
  inspect = require('util').inspect;

class MailReceiver {
  constructor(mailSender) {
    this.mailSender = mailSender;

    this.imap = new Imap({
      user: 'seatreservation@sina.com',
      password: 'Lu5y)E5pj=bQbf',
      host: 'imap.sina.com',
      port: 993,
      tls: true
    });

    this.initImap(this.imap);

  }
  initImap(imap) {
    imap.on('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err;
        imap.search(['UNSEEN'], (err, results) => {
          console.log('unseen mail count: ' + results.length);
          if (err) throw err;
          var f = imap.fetch(results, {
            bodies: 'HEADER.FIELDS (FROM SUBJECT)',
            markSeen: true
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