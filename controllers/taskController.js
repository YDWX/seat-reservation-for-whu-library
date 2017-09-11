const models = require('../models');

class TaskController {
  constructor() {}

  pushTask(userId, taskType = 'seat', seat, startTime, endTime) {
    let opt = {
      userId,
      taskType
    };
    if (taskType == 'seat') {
      opt = Object.assign(opt, {
        seat,
        startTime,
        endTime
      })
    }
    return models.task.create(opt)
  }

  getFailedTasks(afterTime) {
    return models.task.findAll({
      where: {
        status: false,
        finished: true,
        createdAt: {
          $gt: afterTime
        }
      }
    }).then((taskList) => {
      if (taskList && taskList.length) {
        return taskList
      } else {
        return null;
      }
    })
  }

  getTask(id) {
    return models.task.findById(id, {
      include: [{
        model: models.user,
        as: "user"
      }]
    }).then((taskModel) => {
      if (taskModel) {
        return taskModel.dataValues;
      } else {
        return null;
      }
    })
  }

  finishTask(id, status) {
    return models.task.update({
      status,
      finished: true
    }, {
      where: {
        id
      }
    }).then(async(updateArray) => {
      if (!updateArray[0]) {
        return false;
      }
      if (!status) {
        const taskModel = updateArray[0];
        await taskController.pushTask(taskModel.userId, taskModel.taskType, taskModel.seat, taskModel.startTime, taskModel.endTime);
      }
      return true;
    })
  }
}

const taskController = new TaskController();
module.exports = taskController;