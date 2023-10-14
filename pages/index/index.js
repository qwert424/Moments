// index.js
// 获取应用实例
import { formateDate } from "../../utils/util"
import Notify from '@vant/weapp/notify/notify';
const app = getApp();
const db = wx.cloud.database();
const Moments = db.collection('Moments');

Page({
  data: {
    messageList: []//接收到的列表
  },
  handleDelete() {
    this.getData();
  },
  async getData() {
    const resp = await Moments.limit(20).get();
    resp.data.forEach(item => {
      const resp = formateDate(item.time)
      item.time = resp
    })
    this.setData({
      "messageList": resp.data
    })
  },
  onShow() {
    this.getData();
    Notify({ type: 'primary', message: '长按说说即可删除!' ,duration:1000});
  }
})
