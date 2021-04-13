var shortid = require("shortid");
var Mock = require("mockjs");
var Random = Mock.Random;

//必须包含字段id
export default {
  name: "qyeye",
  Name: "Queue",
  properties: [
    {
      key: "id",
      title: "id"
    },
    {
      key: "loadGoodsAddr",
      title: "装货地"
    },
    {
      key: "unloadGoodsAddr",
      title: "卸货地"
    },
    {
      key: "queueStatus",
      title: "排队状态"
    },
    {
      key: "waitingNumber",
      title: "等待号码"
    },
    {
      key: "allocateNum",
      title: "排队号码"
    },
    {
      key: "vno",
      title: "车牌号码"
    },
    {
      key: "code",
      title: "二维码"
    },
  ],
  buildMockData: function () {
    // 不需要生成返回 false
    const number = Random.integer(1, 100);
    let data = [];
    data.push({
      id: shortid.generate(),
      loadGoodsAddr: Random.county(true),
      unloadGoodsAddr: Random.county(true),
      queueStatus: Random.integer(0, 4),
      waitingNumber: number,
      allocateNum: math.min(Random.integer(1, 100), number),
      vno: `川A${Random.cword('1234567890', 4, 5)}`,
      code: Random.url(),
    });
    return data;
  }
};
