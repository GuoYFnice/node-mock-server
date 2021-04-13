import model from "../models/baseModel";

module.exports = {
  getQueueinfo: async () => {
    const db = await model.init("queue");
    const queue = db.value();
    return queue;
  },
  cancel: async () => {
    const db = await model.init('queue');
    await db.assign({ queueStatus: 4, waitingNumber: 0, allocateNum: 0 }).write();
    return {
      success: true,
      msg: "取消成功"
    }
  }
};
