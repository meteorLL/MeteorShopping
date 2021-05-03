// index.js
// 引入用来发送请求的封装好的方法
import { request } from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图数组
        swiperList: [],
        // 导航分类数组
        catesList: [],
        // 楼层数据
        floorList: []
    },


    /**
     * 生命周期函数--监听页面加载
     */
    // 页面开始加载就会触发
    onLoad: function(options) {
        // // 1发送异步请求获取轮播图数据
        // wx.request({
        //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //   success: (result) => {
        //     this.setData({
        //       swiperList:result
        //     })
        //     // console.log(this.data.swiperList);

        //   },
        // });
        this.getSwiperList();
        this.getCatesList();
        this.getFloorList();
    },


    // 获取轮播图数据
    getSwiperList() {
        request({ url: '/home/swiperdata' }).then(result => {
            this.setData({
                swiperList: result
            })
        })
    },
    // 获取导航分类数组
    getCatesList() {
        request({ url: '/home/catitems' }).then(result => {
            // console.log(result);
            this.setData({
                catesList: result
            })
        })
    },
    getFloorList() {
        request({ url: '/home/floordata' }).then(result => {
            console.log(result);
            this.setData({
                floorList: result
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})