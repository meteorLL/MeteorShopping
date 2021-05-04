// 解决异步多次请求，加载图片在第一次请求完就关闭的问题，需要满足一对一的关闭
let ajaxTimes = 0
export const request = (params) => {
    ajaxTimes++;
    // 定义公共的url
    // url：https://api-hmugo-web.itheima.net/api/public/v1
    // 数据请求到之前显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    })

    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);

            },
            fail: (err) => {
                reject(err);
            },
            // 不管成功或者失败都会调用这个函数
            complete: () => {
                ajaxTimes--;
                // 关闭正在等待中的图标
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }

            }
        })
    })
}