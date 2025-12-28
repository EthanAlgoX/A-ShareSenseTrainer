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
        achievements: [],
        winRate: '0',
        isProfitable: false
    },

    onLoad() {
        // 开启分享朋友圈
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
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

        console.info(`[Result] Game Over. Final Capital: ${finalCapital}, Initial: ${initialCapital}`);
        console.info('[Result] Full Stats snapshot:', stats);

        // 计算收益
        const profit = finalCapital - initialCapital;
        const profitPercent = (profit / initialCapital) * 100;

        // 获取称号
        const badge = this.getBadge(finalCapital, initialCapital, stats);

        // 检测成就
        const achievements = soundHelper.checkAchievements(globalData.operations, stats);

        // 计算胜率，防止除以 0
        const totalTrades = stats.winCount + stats.loseCount;
        const winRate = totalTrades > 0 ? ((stats.winCount / totalTrades) * 100).toFixed(0) : '0';

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
            winRate: winRate,
            isProfitable: finalCapital >= initialCapital,
            achievements: achievements
        });

        console.info('[Result] setData completed, WinRate:', winRate);
    },

    // 获取称号
    getBadge(finalCapital, initialCapital, stats) {
        const ratio = finalCapital / initialCapital;

        // 空仓之神：资金约等于初始值且空仓超7次
        if (ratio >= 0.95 && ratio <= 1.05 && stats.waitCount >= 7) {
            return {
                emoji: '🧘',
                title: '空仓之神',
                subtitle: '在贪婪的洪流中，你选择了静默，这本身就是一种伟大的进化。',
                class: 'badge-gold'
            };
        }

        // 终极觉醒者：收益超30%
        if (ratio > 1.30) {
            return {
                emoji: '👑',
                title: '终极觉醒者',
                subtitle: '你已洞悉K线背后的原始代码，财富对你而言只是跳动的溢价。',
                class: 'badge-legendary'
            };
        }

        // 高频掠夺者：收益超20%
        if (ratio > 1.20) {
            return {
                emoji: '⚔️',
                title: '高频掠夺者',
                subtitle: '在瞬息万变的市场中精准狙击，游资大佬见了也要直呼内行。',
                class: 'badge-epic'
            };
        }

        // 算法优化师：收益0-20%
        if (ratio > 1.00) {
            return {
                emoji: '📊',
                title: '算法优化师',
                subtitle: '稳健的博弈频率，你正在建立属于自己的生存闭环。',
                class: 'badge-rare'
            };
        }

        // 幸存数据员：亏损0-10%
        if (ratio >= 0.90) {
            return {
                emoji: '👁️',
                title: '幸存数据员',
                subtitle: '由于观测偏差导致轻微亏损，下一次博弈将修正误差。',
                class: 'badge-common'
            };
        }

        // 系统冗余：亏损10-20%
        if (ratio >= 0.80) {
            return {
                emoji: '🧹',
                title: '系统冗余',
                subtitle: '被市场当做无用数据清理，你的逻辑序列需要彻底重构。',
                class: 'badge-poor'
            };
        }

        // 净值捐赠者：亏损超20%
        return {
            emoji: '🧧',
            title: '净值捐赠者',
            subtitle: '感谢您为A股生态圈提供的流动性，功德+999,999。',
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
    },

    /**
     * 分享到朋友圈
     */
    onShareTimeline() {
        const globalData = app.globalData;
        const ratio = globalData.currentCapital / globalData.initialCapital;
        const profitPercent = ((ratio - 1) * 100).toFixed(2);

        return {
            title: `K线猜猜乐：博弈清算凭证，净值变动 ${profitPercent}%！`,
            query: 'from=timeline'
        };
    }
});
