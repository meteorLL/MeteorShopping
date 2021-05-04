// pages/goods_detail/index.js
// 引入用来发送请求的封装好的方法
/* 2 点击轮播图，预览大图功能
 1 给轮播图绑定点击事件
 2 调用小程序api， previewImage */
/* 
3 点击 加入购物车
1 先绑定点击事件
2 获取缓存中的购物车数据 数组格式 
3 先判断 当前的商品是否已经存在于 购物车
4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
6 弹出提示 */


import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        // 商品详情数据
        goodsObj: {}
    },
    // 商品对象
    goodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const { goods_id } = options;
        // console.log(goods_id);
        this.getGoodsDetail(goods_id);
    },
    // 获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } })
        this.goodsInfo = goodsObj;
        this.setData({
                // 因为只用到这些数据，所以为了提高性能，只需要把这些数据保存
                goodsObj: {
                    pics: goodsObj.pics,
                    goods_name: goodsObj.goods_name,
                    goods_price: goodsObj.goods_price,
                    // 转换图片格式，兼容iPhone手机
                    goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg')

                }
            })
            // console.log(this.data.goodsObj);
    },

    // 点击轮播图放大预览
    handlePreviewImage(e) {
        // console.log('预览');
        const urls = this.goodsInfo.pics.map(v => v.pics_mid)
            // console.log(urls);
            // 调用小程序图片预览api
            // 接收传递过来的图片url
        const currentUrl = e.currentTarget.dataset.url
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls // 需要预览的图片http链接列表,有几个链接放大后就会有多张图片
        })
    },
    // 点击加入购物车
    handleCartAdd() {
        // 1.获取缓存中的购物车数组
        let cart = wx.getStorageSync('cart') || [];
        // 2.判断商品对象是否存在于购物车中
        let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
        if (index === -1) {
            // 3.不存在，商品为第一次添加
            this.goodsInfo.num = 1;
            cart.push(this.goodsInfo)
        } else {
            // 4.已经存在购物车数据了 执行num++
            cart[index].num++
        }
        // 5.把购物车重新添加回缓存中
        wx.setStorageSync("cart", cart);
        // 6.弹窗
        wx.showToast({
            title: '加入成功',
            // 防抖
            icon: 'sucess',
            mask: true
        });
    }
})