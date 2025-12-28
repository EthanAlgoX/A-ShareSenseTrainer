// pages/welcome/welcome.js
const app = getApp();

Page({
    data: {},

    onLoad() {
        // 重置游戏状态
        app.resetGame();
    },

    onShow() {
        // 每次显示时重置
        app.resetGame();
    },

    // 开始游戏
    startGame() {
        // 添加点击反馈
        wx.vibrateShort({ type: 'light' });

        // 跳转到天赋选择页面
        wx.navigateTo({
            url: '/pages/talent/talent'
        });
    },

    /**
     * 分享小程序
     */
    onShareAppMessage() {
        return {
            title: '《股神养成记》：在回撤中生存，在波动中觉醒。',
            path: '/pages/welcome/welcome'
        };
    },

    /**
     * 分享到朋友圈
     */
    onShareTimeline() {
        return {
            title: '股神养成记：系统已就绪，等待博弈序列接入点。',
            query: 'from=timeline'
        };
    }
});
