const models = require("./models");
const schedule = require("./modules/schedule.js");

models.sequelize.sync().then(()=>{
  schedule.start();
})


