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
    }
});
