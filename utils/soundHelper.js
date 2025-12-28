/**
 * soundHelper.js - 音效管理工具
 * 为游戏添加音效反馈
 */

const soundEnabled = true; // 可以添加到全局配置

// 音效类型
const SOUNDS = {
    BUY: 'buy',
    WAIT: 'wait',
    WIN: 'win',
    LOSE: 'lose',
    DODGE: 'dodge',
    LEVEL_UP: 'levelup'
};

/**
 * 播放音效（使用微信内置音效）
 */
function playSound(type) {
    if (!soundEnabled) return;

    try {
        switch (type) {
            case SOUNDS.BUY:
                // 买入音效 - 使用短促的提示音
                wx.vibrateShort({ type: 'heavy' });
                break;
            case SOUNDS.WAIT:
                // 观望音效 - 使用轻柔的提示音
                wx.vibrateShort({ type: 'light' });
                break;
            case SOUNDS.WIN:
                // 盈利音效 - 使用成功提示音
                wx.showToast({
                    title: '',
                    icon: 'success',
                    duration: 500
                });
                wx.vibrateShort({ type: 'medium' });
                break;
            case SOUNDS.LOSE:
                // 亏损音效 - 使用失败提示音
                wx.vibrateShort({ type: 'heavy' });
                setTimeout(() => wx.vibrateShort({ type: 'heavy' }), 100);
                break;
            case SOUNDS.DODGE:
                // 躲避音效 - 使用特殊提示音
                wx.vibrateShort({ type: 'light' });
                setTimeout(() => wx.vibrateShort({ type: 'light' }), 100);
                setTimeout(() => wx.vibrateShort({ type: 'light' }), 200);
                break;
            case SOUNDS.LEVEL_UP:
                // 过关音效
                wx.vibrateShort({ type: 'medium' });
                break;
        }
    } catch (e) {
        console.warn('音效播放失败:', e);
    }
}

/**
 * 股市名言库
 */
const STOCK_QUOTES = [
    "空仓也是一种操作 💡",
    "不要把所有鸡蛋放在一个篮子里 🥚",
    "市场永远是对的 📊",
    "贪婪时恐惧，恐惧时贪婪 🎭",
    "趋势是你的朋友 📈",
    "止损永远不嫌早 🛡️",
    "耐心是投资者的美德 ⏰",
    "不要追涨杀跌 🚫",
    "看不懂的行情不做 👀",
    "保住本金比什么都重要 💰"
];

/**
 * 获取随机股市名言
 */
function getRandomQuote() {
    return STOCK_QUOTES[Math.floor(Math.random() * STOCK_QUOTES.length)];
}

/**
 * 成就检测
 */
function checkAchievements(operations, stats) {
    const achievements = [];

    // 连胜成就
    if (checkWinStreak(operations, 3)) {
        achievements.push({
            icon: '🔥',
            title: '三连胜',
            desc: '连续3次盈利操作'
        });
    }

    // 完美空仓
    if (stats.waitCount >= 7 && stats.dodgeCount >= 3) {
        achievements.push({
            icon: '🛡️',
            title: '防守大师',
            desc: '多次成功躲避暴跌'
        });
    }

    // 全胜
    if (stats.buyCount > 0 && stats.loseCount === 0) {
        achievements.push({
            icon: '👑',
            title: '无敌战神',
            desc: '所有买入操作全部盈利'
        });
    }

    // 稳健投资
    if (stats.buyCount <= 3 && stats.waitCount >= 7) {
        achievements.push({
            icon: '🎯',
            title: '稳健投资者',
            desc: '精选时机，谨慎出手'
        });
    }

    return achievements;
}

/**
 * 检查连胜
 */
function checkWinStreak(operations, count) {
    if (operations.length < count) return false;

    const recent = operations.slice(-count);
    return recent.every(op =>
        (op.choice === 'buy' && op.changePercent > 0) ||
        (op.choice === 'wait' && op.changePercent < -0.02)
    );
}

module.exports = {
    SOUNDS,
    playSound,
    getRandomQuote,
    checkAchievements
};
