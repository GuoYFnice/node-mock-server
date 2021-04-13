import * as responseTemplate from "../lib/responseTemplate";
import queueService from "../services/queueService";

export const queue = async ctx => {
  const queueInfo = await queueService.getQueueinfo();
  return responseTemplate.success(ctx, {
    id: queueInfo.id,
    loadGoodsAddr: queueInfo.loadGoodsAddr,
    unloadGoodsAddr: queueInfo.unloadGoodsAddr,
    queueStatus: queueInfo.queueStatus,
    waitingNumber: queueInfo.waitingNumber,
    allocateNum: queueInfo.allocateNum,
    vno: queueInfo.vno,
    code: queueInfo.code
  });
};

export const cancel = async ctx => {
  const cancel = await queueService.cancel();
  return responseTemplate.success(ctx, {
    message: cancel.msg
  });
};
