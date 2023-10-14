// components/messageItem/messageItem.js

const db = wx.cloud.database();
const Moments = db.collection('Moments');

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        item: Object
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleTap(event) {
            const newArrList = [];
            const index = event.currentTarget.dataset.index
            this.properties.item.fileList.forEach(item => {
                newArrList.push(item.url)
            })
            this.setData({
                newArrList
            })
            wx.previewImage({
                urls: newArrList,
                current: newArrList[index]
            })
        },
        handleLongPress() {
            // console.log(e,this.properties.item)
            wx.showModal({
                title: '确定删除',
                content: '是否删除这条说说？',
                complete: (res) => {
                    if (res.cancel) {
                        wx.showToast({
                            title: '取消删除',
                            icon: 'error'
                        })
                    }
                    if (res.confirm) {
                        Moments.doc(this.properties.item._id).remove({
                            success:()=> {
                                wx.showToast({
                                    title: '删除成功',
                                    icon:'success'
                                }),
                                this.triggerEvent('renovate')
                            }
                        })

                    }
                }
            })
          

        }
    }
})