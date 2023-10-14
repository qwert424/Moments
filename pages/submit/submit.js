// pages/submit/submit.js
import Notify from '@vant/weapp/notify/notify';
const db = wx.cloud.database();
const Moments = db.collection("Moments")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: "",//用户输入
        fileList: [],//图片列表
        essMsg: "",//错误消息
        title: ""//标题
    },
    // 删除图片
    handleDetele(e) {
        const newFileList = this.data.fileList
       newFileList.splice(e.detail.index,1)
        this.setData({
            fileList:newFileList
        })
    },
    // 上传检验
    beforeRead(event) {
        const { file, callback } = event.detail;
        file.forEach(item => {
            callback(item.type === 'image');
        })
    },
    // 上传图片
    afterRead(event) {
        const { file } = event.detail;
        const newFileList = this.data.fileList
        file.forEach(item => {
            newFileList.push({
                url: item.url
            })
            this.setData({
                fileList: newFileList
            })
        })
    },
    // 失去焦点判断
    handleBlur() {
        if (this.data.title === "") {
            this.setData({
                "essMsg": "标题不能为空"
            })
            return false;
        } else {
            this.setData({
                "essMsg": ""
            })
            return true;
        }

    },
    // 发布函数
    handleClick() {
        if (!this.handleBlur()) {
            return
        }
        wx.showLoading({
            title: '发布中',
        })
        // 1、上传图片
        if (this.data.fileList.length) {
            for (let i = 0; i < this.data.fileList.length; i++) {
                const random = Math.random() * 100000;
                const name = this.data.fileList[i].url.match(/\.[^.]+?$/g)[0];
                wx.cloud.uploadFile({
                    cloudPath: random + name,
                    filePath: this.data.fileList[i].url
                })
                if (i === this.data.fileList.length - 1) {
                    // 最后一张图
                    this.addMessage()
                }
            }
        } else {
            this.addMessage()
        }
    },
    addMessage() {
        Moments.add({
            data: {
                fileList: this.data.fileList,
                inputValue: this.data.inputValue,
                time: new Date().getTime().toString(),
                title: this.data.title
            },
            success: () => {
                wx.hideLoading();
                Notify({ type: 'success', message: '发布成功', duration: 1000 });
            },
            complete: () => {
                this.setData({
                    inputValue: "",//用户输入
                    fileList: [],//图片列表
                    essMsg: "",//错误消息
                    title: ""//标题
                })
            }
        })
    }

})