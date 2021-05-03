// pages/category/index.js
// 引入用来发送请求的封装好的方法
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 左侧的菜单数据
        leftMenuList: [],
        // 右侧的商品数据
        rightGoodsContent: [],
        // 被点击的左侧菜单
        currentIndex: 0,
        // 页面距离顶部的距离
        scrollTop: 0
    },
    // 接口返回的数据
    Cates: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /*
        0 web中的本地存储和小程序中的本地存储的区别
        1 写代码方式不一样
        web：localStorage.setItem("key","value") localstorage.getiItem("key")
        小程序中：wxwx.setStorageSync('key', 'value);wx.getStorageSync('key')
        2 存的时候，有没有做类型转换
        web中会把数据变为字符串
        小程序中不存在类型转换
        1 先判断一下本地存储中有没有旧的数据
        {time:Date.now(),data:[...]}
        2 没有旧数据就直接发送新请求
        3 有旧数据，并且旧数据没有过期，就使用本地存储中的旧数据即可
        */
        //  1 获取本地存储中的数据，（小程序也是存在本地存储技术）
        const Cates = wx.getStorageSync("cates");
        //  2 判断
        if (!Cates) {
            this.getCates();
        } else {
            // 有旧的数据，定义过期时间
            if (Date.now() - Cates.time > 1000 * 600) {
                // 发送请求
                this.getCates();
            } else {
                // 可以使用旧数据
                this.Cates = Cates.data
                    // 构造左侧的大菜单数据
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightGoodsContent = this.Cates[0].children
                this.setData({
                    leftMenuList,
                    rightGoodsContent
                })
            }
        }
    },
    // 获取分类数据
    async getCates() {
        // request({
        //   url:"/categories"
        // }).then(result=>{
        //   console.log(result);

        //   this.Cates=result.data.message
        //   // 把接口的数据存入到本地存储中
        //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
        //   // 构造左侧的大菜单数据
        //   let leftMenuList=this.Cates.map(v=>v.cat_name);
        //   let rightGoodsContent =this.Cates[0].children
        //   this.setData({
        //     leftMenuList,
        //     rightGoodsContent
        //   })
        //   // console.log(result);

        // })

        // 使用es7的async和await 来发送请求
        const result = await request({ url: '/categories' })
        this.Cates = result
            // 把接口的数据存入到本地存储中
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
            // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightGoodsContent = this.Cates[0].children
        this.setData({
            leftMenuList,
            rightGoodsContent
        })
    },
    // 左侧菜单的点击事件
    handleItemTap(e) {
        // console.log(e);
        // 1 获取被点击的标题上的索引
        // 2 给data中的currentIndexfuzhi
        // 3根据不同的索引渲染右侧的页面
        const { index } = e.currentTarget.dataset;
        let rightGoodsContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightGoodsContent,
            // 重新设置右侧内容的scroll-view距离顶部的距离
            scrollTop: 0
        })
    }

})