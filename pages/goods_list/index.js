/*
一 滑到底部，到下一页
1 用户上滑页面 滚动条触底 开始加载下一页数据
（1）找到滚动条触底事件 去微信小程序官方文档 中去寻找
（2）判断还有没有下一页数据
  获取到总页数
  总页数=Math.ceil(总条数/页容量 pagesize) 这个方法的意思是向上取整
  Math.ceil(23 /10)=3
  获取到当前的页码
  判断当前的页码是否大于总页数
（3）假如没有下一页数据 弹出一个提示
（4）假如还有下一页数据 来加载下一页数据
1 当前页面++
2 重新发送请求
3 数据请求回来 要对data进行数组拼接 而不是全部替换 
重要：数组必须拼接，不然滑下来后请求数据为最后一页的数据，不能上滑

二 下拉刷新页面
1 触发下拉刷新页面书事件 (需要在页面的json文件中开启一个配置项)
(1)找到触发下拉刷新的事件
2 重置数组数据
3 重置页码 设置为1
4 发送数据请求
5 数据请求回来 在请求数据最后关闭等待效果
 wx.stopPullDownRefresh()
*/
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // tab栏数据
        tabs: [{
                id: 0,
                value: '综合',
                isActive: true
            },
            {
                id: 1,
                value: '销量',
                isActive: false
            },
            {
                id: 2,
                value: '价格',
                isActive: false
            }
        ],
        goodsList: [],
        // 是否触底
        ReachBottom: false

    },
    // 接口要的参数
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10

    },
    // 总页数
    totalPages: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.QueryParams.cid = options.cid;
        this.getGoodsList()

    },
    // 获取商品列表的数据
    async getGoodsList() {
        const res = await request({
            url: '/goods/search',
            data: this.QueryParams
        })
        const { total } = res
        // 计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
        this.setData({
                // 拼接数组
                goodsList: [...this.data.goodsList, ...res.goods]
            })
            // console.log(res);
            // 关闭下拉刷新的窗口
        wx.stopPullDownRefresh();
    },
    // 标题的点击事件，从子组件中传递过来
    handleTabsItemChange(e) {
        // console.log(e);
        //1 获取被点击的标题索引
        const { index } = e.detail
            //2  修改原数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        //    赋值
        this.setData({
            tabs
        })
    },
    // 滚动条触底事件
    onReachBottom() {
        // console.log('页面触底');
        // 判断触底后 后面还有数据没
        if (this.QueryParams.pagenum >= this.totalPages) {
            // 没有下一页数据了
            this.setData({
                ReachBottom: true
            })
        } else {
            this.QueryParams.pagenum++;
            this.getGoodsList()
            this.setData({
                ReachBottom: false
            })

        }

    },
    // 下拉刷新事件
    onPullDownRefresh() {
        // 重置数组
        this.setData({
            goodsList: [],
        });
        // 重置页码
        this.QueryParams.pagenum = 1;
        // 重新发送请求
        this.getGoodsList();
    }





})