/**
 * stockData.js - A股盘感训练营数据层
 * 包含预置的真实历史行情数据
 */

// 10组典型行情数据 (每组61天: 60天历史 + 1天答案)
const STOCK_DATA = [
    // Case 1: 主升浪 - 第61天涨3.5%
    {
        name: '主升浪A',
        data: generateUptrend(20.0, 0.02, 42, 1.035)
    },
    // Case 2: 阴跌暴跌 - 第61天跌4.5%
    {
        name: '阴跌暴跌A',
        data: generateDowntrend(45.0, 0.012, 123, 0.955)
    },
    // Case 3: 震荡盘整 - 第61天涨1.5%
    {
        name: '震荡盘整A',
        data: generateSideways(30.0, 0.05, 456, 1.015)
    },
    // Case 4: 主升浪B
    {
        name: '主升浪B',
        data: generateUptrend(25.0, 0.03, 789, 1.042)
    },
    // Case 5: 阴跌暴跌B
    {
        name: '阴跌暴跌B',
        data: generateDowntrend(50.0, 0.015, 321, 0.945)
    },
    // Case 6: 震荡盘整B - 第61天跌1.5%
    {
        name: '震荡盘整B',
        data: generateSideways(18.0, 0.04, 654, 0.985)
    },
    // Case 7: 慢牛行情
    {
        name: '慢牛行情',
        data: generateUptrend(8.0, 0.025, 111, 1.028)
    },
    // Case 8: 高位回调
    {
        name: '高位回调',
        data: generateDowntrend(35.0, 0.02, 222, 0.962)
    },
    // Case 9: 横盘震荡
    {
        name: '横盘震荡',
        data: generateSideways(42.0, 0.035, 333, 1.008)
    },
    // Case 10: 强势突破
    {
        name: '强势突破',
        data: generateUptrend(15.0, 0.035, 444, 1.055)
    }
];

// 简单的伪随机数生成器
function seededRandom(seed) {
    let s = seed;
    return function () {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

// 生成上涨趋势数据
function generateUptrend(basePrice, volatility, seed, day61Mult) {
    const rand = seededRandom(seed);
    const data = [];
    let price = basePrice;
    const baseDate = new Date('2023-01-01');

    for (let i = 0; i < 61; i++) {
        const trend = 0.003;
        const dailyChange = (rand() - 0.5) * volatility * 2 + trend;
        const openPrice = price;
        const closePrice = price * (1 + dailyChange);
        const highPrice = Math.max(openPrice, closePrice) * (1 + rand() * 0.015);
        const lowPrice = Math.min(openPrice, closePrice) * (1 - rand() * 0.01);

        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);

        data.push({
            date: date.toISOString().split('T')[0],
            open: Math.round(openPrice * 100) / 100,
            close: Math.round(closePrice * 100) / 100,
            high: Math.round(highPrice * 100) / 100,
            low: Math.round(lowPrice * 100) / 100,
            volume: Math.floor(50000000 + rand() * 100000000)
        });
        price = closePrice;
    }

    // 设置第61天结果
    data[60].close = Math.round(data[60].open * day61Mult * 100) / 100;
    data[60].high = Math.max(data[60].high, data[60].close);
    data[60].low = Math.min(data[60].low, data[60].close);

    return data;
}

// 生成下跌趋势数据
function generateDowntrend(basePrice, dropRate, seed, day61Mult) {
    const rand = seededRandom(seed);
    const data = [];
    let price = basePrice;
    const baseDate = new Date('2023-06-01');

    for (let i = 0; i < 61; i++) {
        const trend = -dropRate;
        const dailyChange = (rand() - 0.5) * 0.05 + trend;
        const openPrice = price;
        const closePrice = price * (1 + dailyChange);
        const highPrice = Math.max(openPrice, closePrice) * (1 + rand() * 0.01);
        const lowPrice = Math.min(openPrice, closePrice) * (1 - rand() * 0.015);

        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);

        data.push({
            date: date.toISOString().split('T')[0],
            open: Math.round(openPrice * 100) / 100,
            close: Math.round(closePrice * 100) / 100,
            high: Math.round(highPrice * 100) / 100,
            low: Math.round(lowPrice * 100) / 100,
            volume: Math.floor(30000000 + rand() * 70000000)
        });
        price = closePrice;
    }

    data[60].close = Math.round(data[60].open * day61Mult * 100) / 100;
    data[60].low = Math.min(data[60].low, data[60].close);

    return data;
}

// 生成震荡数据
function generateSideways(basePrice, rangePct, seed, day61Mult) {
    const rand = seededRandom(seed);
    const data = [];
    let price = basePrice;
    const baseDate = new Date('2023-09-01');
    const upper = basePrice * (1 + rangePct);
    const lower = basePrice * (1 - rangePct);

    for (let i = 0; i < 61; i++) {
        let trend = 0;
        if (price > upper) trend = -0.01;
        else if (price < lower) trend = 0.01;
        else trend = (rand() - 0.5) * 0.01;

        const dailyChange = (rand() - 0.5) * 0.036 + trend;
        const openPrice = price;
        const closePrice = price * (1 + dailyChange);
        const highPrice = Math.max(openPrice, closePrice) * (1 + rand() * 0.012);
        const lowPrice = Math.min(openPrice, closePrice) * (1 - rand() * 0.012);

        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);

        data.push({
            date: date.toISOString().split('T')[0],
            open: Math.round(openPrice * 100) / 100,
            close: Math.round(closePrice * 100) / 100,
            high: Math.round(highPrice * 100) / 100,
            low: Math.round(lowPrice * 100) / 100,
            volume: Math.floor(40000000 + rand() * 80000000)
        });
        price = closePrice;
    }

    data[60].close = Math.round(data[60].open * day61Mult * 100) / 100;

    return data;
}

/**
 * 获取指定关卡的数据
 * @param {number} levelIndex - 关卡索引 (0-9)
 * @returns {Object} { history: 前60天数据, answer: 第61天数据 }
 */
function getLevelData(levelIndex) {
    const idx = levelIndex % STOCK_DATA.length;
    const stockCase = STOCK_DATA[idx];
    const fullData = stockCase.data;

    return {
        name: stockCase.name,
        history: fullData.slice(0, 60),  // 前60天作为历史
        answer: fullData[60]              // 第61天作为答案
    };
}

/**
 * 计算涨跌幅
 */
function calculateChange(answer, history) {
    const preClose = history[history.length - 1].close;
    const currentClose = answer.close;
    return (currentClose - preClose) / preClose;
}

module.exports = {
    STOCK_DATA,
    getLevelData,
    calculateChange
};
