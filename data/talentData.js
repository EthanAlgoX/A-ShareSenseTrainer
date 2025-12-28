/**
 * talentData.js - 天赋/Buff 数据
 * Roguelike 机制的核心
 */

const TALENTS = [
    {
        id: 'insider',
        name: '深层扫描',
        icon: '🔍',
        description: '成功入侵明日成交量接口，可查看量能柱',
        effect: 'show_volume',
        rarity: 'rare'
    },
    {
        id: 'leverage',
        name: '算力杠杆',
        icon: '💰',
        description: '强制接入高能杠杆，收益与风险同步翻倍',
        effect: 'double_profit',
        rarity: 'epic'
    },
    {
        id: 'halt',
        name: '自愈协议',
        icon: '🛡️',
        description: '单次净值跌幅超5%时强制执行回滚保护',
        effect: 'loss_protection',
        rarity: 'legendary'
    },
    {
        id: 'banker',
        name: '庄家后门',
        icon: '🎰',
        description: '劫持市场空隙，空仓时同步获得1%利差',
        effect: 'idle_income',
        rarity: 'rare'
    },
    {
        id: 'prophet',
        name: '趋势追踪',
        icon: '📊',
        description: '算法追踪，可查看MA60长期波动中轴',
        effect: 'show_ma60',
        rarity: 'rare'
    },
    {
        id: 'lucky',
        name: '起源模块',
        icon: '🍀',
        description: '博弈初始阶段自带幸运光环，首战必胜',
        effect: 'first_win',
        rarity: 'legendary'
    },
    {
        id: 'steady',
        name: '频率修正',
        icon: '🎯',
        description: '过滤极端波动噪音，盈亏收窄但胜率稳定',
        effect: 'half_volatility',
        rarity: 'common'
    },
    {
        id: 'gambler',
        name: '逻辑旁路',
        icon: '🎲',
        description: '每3轮可选择绕过当前博弈，随机抽取分红',
        effect: 'skip_chance',
        rarity: 'epic'
    },
    {
        id: 'analyst',
        name: '分析补丁',
        icon: '📰',
        description: '情报强化，自动标记市场传闻的倾向性',
        effect: 'news_hint',
        rarity: 'rare'
    },
    {
        id: 'timetravel',
        name: '快照回滚',
        icon: '⏰',
        description: '获取一次撤销历史错误决策的机会',
        effect: 'undo_once',
        rarity: 'legendary'
    }
];

/**
 * 随机抽取N个天赋
 */
function drawTalents(count = 3) {
    const shuffled = [...TALENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * 根据稀有度获取颜色
 */
function getRarityColor(rarity) {
    const colors = {
        common: '#a0a0b0',
        rare: '#00bbf9',
        epic: '#9b5de5',
        legendary: '#ffd700'
    };
    return colors[rarity] || colors.common;
}

/**
 * 根据稀有度获取中文名称
 */
function getRarityName(rarity) {
    const names = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说'
    };
    return names[rarity] || '普通';
}

module.exports = {
    TALENTS,
    drawTalents,
    getRarityColor,
    getRarityName
};
