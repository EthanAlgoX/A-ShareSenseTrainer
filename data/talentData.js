/**
 * talentData.js - 天赋/Buff 数据
 * Roguelike 机制的核心
 */

const TALENTS = [
    {
        id: 'insider',
        name: '内幕消息',
        icon: '🔍',
        description: '可以提前看到明天的成交量柱状图',
        effect: 'show_volume',
        rarity: 'rare'
    },
    {
        id: 'leverage',
        name: '融资融券',
        icon: '💰',
        description: '收益和亏损都翻倍（2x杠杆）',
        effect: 'double_profit',
        rarity: 'epic'
    },
    {
        id: 'halt',
        name: '停牌重组',
        icon: '🛡️',
        description: '单次亏损超过5%时，强制回退到本金不变',
        effect: 'loss_protection',
        rarity: 'legendary'
    },
    {
        id: 'banker',
        name: '庄家抬轿',
        icon: '🎰',
        description: '空仓时也能获得1%的理财收益',
        effect: 'idle_income',
        rarity: 'rare'
    },
    {
        id: 'prophet',
        name: '技术大师',
        icon: '📊',
        description: '可以看到MA60均线（长期趋势）',
        effect: 'show_ma60',
        rarity: 'rare'
    },
    {
        id: 'lucky',
        name: '财神附体',
        icon: '🍀',
        description: '首次操作必定盈利',
        effect: 'first_win',
        rarity: 'legendary'
    },
    {
        id: 'steady',
        name: '稳健投资',
        icon: '🎯',
        description: '盈亏幅度减半，但胜率提升',
        effect: 'half_volatility',
        rarity: 'common'
    },
    {
        id: 'gambler',
        name: '梭哈之王',
        icon: '🎲',
        description: '每3关可以选择跳过，直接获得±10%随机收益',
        effect: 'skip_chance',
        rarity: 'epic'
    },
    {
        id: 'analyst',
        name: '研报专家',
        icon: '📰',
        description: '小道消息的真实性提示（利好/利空标记）',
        effect: 'news_hint',
        rarity: 'rare'
    },
    {
        id: 'timetravel',
        name: '时光倒流',
        icon: '⏰',
        description: '一次机会重新选择上一关的决策',
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
