// pages/result/result.js
const app = getApp();
const soundHelper = require('../../utils/soundHelper.js');

Page({
    data: {
        finalCapital: '0.00',
        profitClass: '',
        profitChangeText: '',
        profitPercent: '',
        profitChangeClass: '',
        badgeEmoji: '',
        badgeTitle: '',
        badgeSubtitle: '',
        badgeClass: '',
        buyCount: 0,
        waitCount: 0,
        winCount: 0,
        loseCount: 0,
        dodgeCount: 0,
        missCount: 0,
        particles: [],
        achievements: []
    },

    onLoad() {
        this.generateParticles();
        this.calculateResult();
    },

    // 生成粒子
    generateParticles() {
        const particles = [];
        for (let i = 0; i < 20; i++) {
            particles.push({
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                delay: Math.random() * 3 + 's'
            });
        }
        this.setData({ particles });
    },

    // 计算结果
    calculateResult() {
        const globalData = app.globalData;
        const finalCapital = globalData.currentCapital;
        const initialCapital = globalData.initialCapital;
        const stats = globalData.stats;

        // 计算收益
        const profit = finalCapital - initialCapital;
        const profitPercent = (profit / initialCapital) * 100;

        // 获取称号
        const badge = this.getBadge(finalCapital, initialCapital, stats);

        // 检测成就
        const achievements = soundHelper.checkAchievements(globalData.operations, stats);

        this.setData({
            finalCapital: this.formatMoney(finalCapital),
            profitClass: profit >= 0 ? 'profit-up' : 'profit-down',
            profitChangeText: `${profit >= 0 ? '+' : ''}${this.formatMoney(profit)}`,
            profitPercent: `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`,
            profitChangeClass: profit >= 0 ? 'rise' : 'fall',
            badgeEmoji: badge.emoji,
            badgeTitle: badge.title,
            badgeSubtitle: badge.subtitle,
            badgeClass: badge.class,
            buyCount: stats.buyCount,
            waitCount: stats.waitCount,
            winCount: stats.winCount,
            loseCount: stats.loseCount,
            dodgeCount: stats.dodgeCount,
            missCount: stats.missCount,
            achievements: achievements
        });
    },

    // 获取称号
    getBadge(finalCapital, initialCapital, stats) {
        const ratio = finalCapital / initialCapital;

        // 空仓之王：资金约等于初始值且空仓超7次
        if (ratio >= 0.95 && ratio <= 1.05 && stats.waitCount >= 7) {
            return {
                emoji: '👑',
                title: '空仓之王',
                subtitle: '知行合一，空仓也是一种操作',
                class: 'badge-gold'
            };
        }

        // 巴菲特分特：收益超30%
        if (ratio > 1.30) {
            return {
                emoji: '🦅',
                title: '巴菲特分特',
                subtitle: '一代股神，财务自由指日可待',
                class: 'badge-legendary'
            };
        }

        // 游资大佬：收益超20%
        if (ratio > 1.20) {
            return {
                emoji: '🚀',
                title: '游资大佬',
                subtitle: '嗅觉敏锐，擅长捕捉主升浪',
                class: 'badge-epic'
            };
        }

        // 稳健理财师：收益0-20%
        if (ratio > 1.00) {
            return {
                emoji: '📈',
                title: '稳健理财师',
                subtitle: '稳扎稳打，懂得风险控制',
                class: 'badge-rare'
            };
        }

        // 保本选手：亏损0-10%
        if (ratio >= 0.90) {
            return {
                emoji: '😅',
                title: '保本选手',
                subtitle: '小亏当赢，下次再战',
                class: 'badge-common'
            };
        }

        // 绿油油：亏损10-20%
        if (ratio >= 0.80) {
            return {
                emoji: '🥬',
                title: '绿油油',
                subtitle: '被市场收割，需要反思',
                class: 'badge-poor'
            };
        }

        // A股慈善家：亏损超20%
        return {
            emoji: '💸',
            title: 'A股慈善家',
            subtitle: '为国接盘，感谢你的付出',
            class: 'badge-worst'
        };
    },

    // 格式化金额
    formatMoney(amount) {
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // 再来一局
    playAgain() {
        app.resetGame();
        wx.reLaunch({
            url: '/pages/welcome/welcome'
        });
    },

    // 分享
    onShareAppMessage() {
        const globalData = app.globalData;
        const ratio = globalData.currentCapital / globalData.initialCapital;
        const profitPercent = ((ratio - 1) * 100).toFixed(2);
        const talentName = globalData.talent ? globalData.talent.name : '无';

        let title = '';
        const achievements = this.data.achievements;

        if (achievements.length > 0 && achievements.some(a => a.title === '无敌战神')) {
            title = `【封神榜】A股战神在此！收益${profitPercent}%，谁敢来战？`;
        } else if (ratio > 1.2) {
            title = `【龙虎榜】悟道了！${talentName}加持，狂赚${profitPercent}%！`;
        } else if (ratio > 1) {
            title = `盘感训练：小赚${profitPercent}%，${talentName}有点东西！`;
        } else if (ratio < 0.8) {
            title = `【比惨大会】亏了${Math.abs(profitPercent)}%，天台风好大...求安慰😭`;
        } else {
            title = `A股模拟人生：我不亏就是赚！来试试你能活过几关？`;
        }

        return {
            title: title,
            path: '/pages/welcome/welcome',
            imageUrl: '' // 建议后续添加一张通用的分享图
        };
    }
});
