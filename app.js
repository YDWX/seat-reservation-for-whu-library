const models = require("./models");
const taskHandler = require("./modules/taskHandler.js");

// models.sequelize.sync().then(()=>{
  taskHandler.start();
// })


