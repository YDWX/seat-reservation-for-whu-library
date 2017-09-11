const seatApi = require('../seatApi');
class SeatManager {
  constructor() {}

  bookSeat(token, date, seat, startTime, endTime) {
    return seatApi.POST_RESERVATION(token, date, seat, startTime, endTime)
      .then(({
        data
      }) => {
        if (data.status == 'success') {
          return true;
        } else {
          return false;
        }
      })
  }
}

const seatManager = new SeatManager();
module.exports = seatManager;