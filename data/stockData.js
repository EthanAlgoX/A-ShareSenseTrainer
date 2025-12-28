/**
 * stockData.js - A股觉醒计划数据引擎
 * 支持动态生成 1000+ 种各异的市场博弈场景
 */

// 场景类型定义
const SCENARIO_TYPES = [
    { name: '主升浪', type: 'uptrend', probability: 0.25 },
    { name: '阴跌阴跌', type: 'downtrend', probability: 0.25 },
    { name: '震荡收窄', type: 'sideways', probability: 0.25 },
    { name: '强势突破', type: 'uptrend_fast', probability: 0.15 },
    { name: '无情收割', type: 'downtrend_fast', probability: 0.10 }
];

/**
 * 核心引擎：根据种子生成唯一确定的关卡数据
 * @param {number} seed - 种子ID (0-999)
 * @returns {Object} 关卡数据
 */
function generateScenarioBySeed(seed) {
    const rand = seededRandom(seed);

    // 确定场景类型
    const typePick = rand();
    let selectedType = SCENARIO_TYPES[0];
    let cumulative = 0;
    for (const st of SCENARIO_TYPES) {
        cumulative += st.probability;
        if (typePick <= cumulative) {
            selectedType = st;
            break;
        }
    }

    const basePrice = 10 + rand() * 90; // 10-100元基础价格
    const volatility = 0.01 + rand() * 0.04;

    let history = [];
    let answer = null;

    // 根据类型调用不同的生成算法
    switch (selectedType.type) {
        case 'uptrend':
            history = generateKLines(basePrice, volatility, 0.003, seed, 60);
            answer = generateKLines(history[59].close, volatility, 0.003, seed + 1000, 1, 1.02 + rand() * 0.05)[0];
            break;
        case 'uptrend_fast':
            history = generateKLines(basePrice, volatility * 1.5, 0.006, seed, 60);
            answer = generateKLines(history[59].close, volatility * 2, 0.008, seed + 1000, 1, 1.05 + rand() * 0.05)[0];
            break;
        case 'downtrend':
            history = generateKLines(basePrice, volatility, -0.003, seed, 60);
            answer = generateKLines(history[59].close, volatility, -0.003, seed + 1000, 1, 0.95 + rand() * 0.03)[0];
            break;
        case 'downtrend_fast':
            history = generateKLines(basePrice, volatility * 1.2, -0.005, seed, 60);
            answer = generateKLines(history[59].close, volatility * 1.5, -0.008, seed + 1000, 1, 0.90 + rand() * 0.05)[0];
            break;
        default: // sideways
            history = generateKLines(basePrice, volatility, 0, seed, 60, null, true);
            answer = generateKLines(history[59].close, volatility, 0, seed + 1000, 1, 0.98 + rand() * 0.04)[0];
    }

    return {
        name: `${selectedType.name} #${seed}`,
        history: history,
        answer: answer
    };
}

// 通用 K 线生成逻辑
function generateKLines(startPrice, volatility, trend, seed, count, forcedMult = null, isSideways = false) {
    const rand = seededRandom(seed);
    const data = [];
    let price = startPrice;
    const baseDate = new Date('2024-01-01');

    for (let i = 0; i < count; i++) {
        let dailyTrend = trend;
        if (isSideways) {
            // 震荡模式修正
            if (price > startPrice * 1.1) dailyTrend = -0.01;
            else if (price < startPrice * 0.9) dailyTrend = 0.01;
        }

        const change = (rand() - 0.5) * volatility * 2 + dailyTrend;
        const open = price;
        let close = price * (1 + change);

        // 强制涨跌幅（针对答案页）
        if (forcedMult !== null && i === count - 1) {
            close = open * forcedMult;
        }

        const high = Math.max(open, close) * (1 + rand() * volatility);
        const low = Math.min(open, close) * (1 - rand() * volatility);
        const volume = Math.floor(1000000 + rand() * 9000000);

        data.push({
            date: `D-${i}`, // 简化日期展示
            open: Number(open.toFixed(2)),
            close: Number(close.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            volume: volume
        });
        price = close;
    }
    return data;
}

// 种子随机数
function seededRandom(seed) {
    let s = seed;
    return function () {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

/**
 * 获取本次 Session 抽取的关卡数据
 * @param {Array} sessionSeeds - Session 中的种子列表
 * @param {number} levelIndex - 1-10 关索引
 */
function getLevelDataFromSession(sessionSeeds, levelIndex) {
    const seed = sessionSeeds[levelIndex - 1] || 0;
    return generateScenarioBySeed(seed);
}

module.exports = {
    generateScenarioBySeed,
    getLevelDataFromSession,
    // 兼容旧接口（如果其他地方在用）
    getLevelData: (idx) => generateScenarioBySeed(idx)
};

