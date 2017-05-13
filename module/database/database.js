var mongoose = require("mongoose"); //  顶会议用户组件

mongoose.connect('mongodb://localhost/seatreservation');

module.exports = mongoose;
