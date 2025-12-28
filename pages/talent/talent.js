// pages/talent/talent.js
const app = getApp();
const talentData = require('../../data/talentData.js');

Page({
    data: {
        talents: [],
        selectedTalent: null
    },

    onLoad() {
        this.drawTalents();
    },

    // 抽取天赋
    drawTalents() {
        const drawnTalents = talentData.drawTalents(3);

        // 添加稀有度颜色和名称
        const talents = drawnTalents.map(t => ({
            ...t,
            rarityColor: talentData.getRarityColor(t.rarity),
            rarityName: talentData.getRarityName(t.rarity)
        }));

        this.setData({ talents });
    },

    // 选择天赋
    selectTalent(e) {
        const id = e.currentTarget.dataset.id;

        // 震动反馈
        wx.vibrateShort({ type: 'light' });

        this.setData({
            selectedTalent: id
        });
    },

    // 确认选择
    confirmTalent() {
        if (!this.data.selectedTalent) return;

        const selected = this.data.talents.find(t => t.id === this.data.selectedTalent);

        // 保存到全局数据
        app.globalData.talent = selected;

        // 震动反馈
        wx.vibrateShort({ type: 'medium' });

        // 显示提示
        wx.showToast({
            title: `已选择：${selected.name}`,
            icon: 'success',
            duration: 1500
        });

        // 跳转到交易页面
        setTimeout(() => {
            wx.redirectTo({
                url: '/pages/trading/trading'
            });
        }, 1500);
    }
});
