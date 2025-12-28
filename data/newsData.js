/**
 * newsData.js - 小道消息数据
 * 用于干扰用户判断，增加游戏趣味性
 */

// 利好消息（通常暗示看涨）
const BULLISH_NEWS = [
    "🔥 传闻：某知名游资大佬已入驻",
    "📈 研报：行业龙头，给予'强烈买入'评级",
    "💰 公告：公司回购股份，彰显信心",
    "🚀 消息：产品获得重大突破，市场前景广阔",
    "👔 独家：机构调研密集，主力资金暗流涌动",
    "📊 数据：北向资金大幅流入，外资看好",
    "🎯 爆料：即将公布超预期业绩",
    "💎 内幕：战略投资者即将入股"
];

// 利空消息（通常暗示看跌）
const BEARISH_NEWS = [
    "⚠️ 新闻：董事长因离婚进行财产分割",
    "📉 公告：大股东减持计划公布",
    "🔴 警示：监管层约谈，合规风险上升",
    "💸 消息：业绩预告不及预期，利润下滑",
    "😰 传闻：核心技术人员集体离职",
    "📰 报道：行业政策收紧，前景堪忧",
    "⛔ 风险：原材料价格暴涨，成本压力巨大",
    "🚨 爆料：财务造假嫌疑，证监会介入调查"
];

// 中性/段子消息（娱乐向，不影响判断）
const NEUTRAL_NEWS = [
    "💬 弹幕：老乡别走，技术性调整而已！",
    "🤔 股评：这波不亏，下次一定能赚回来",
    "😅 网友：我已经在天台排队了，前面还有200人",
    "🎭 段子：炒股就是心态，心态好了啥都好",
    "🍜 热评：今晚又要关灯吃面了...",
    "🎪 吐槽：主力洗盘，散户别慌！（真的吗？）",
    "🎨 名言：股市有风险，入市需谨慎",
    "🎯 提示：不要把鸡蛋放在一个篮子里",
    "💡 建议：空仓也是一种操作",
    "🎲 玄学：今日宜买入，忌追高"
];

/**
 * 随机获取一条消息
 */
function getRandomNews() {
    const allNews = [...BULLISH_NEWS, ...BEARISH_NEWS, ...NEUTRAL_NEWS];
    return allNews[Math.floor(Math.random() * allNews.length)];
}

/**
 * 根据类型获取消息
 */
function getNewsByType(type) {
    let pool = NEUTRAL_NEWS;
    if (type === 'bullish') pool = BULLISH_NEWS;
    else if (type === 'bearish') pool = BEARISH_NEWS;

    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 判断消息类型（用于研报专家天赋）
 */
function getNewsType(news) {
    if (BULLISH_NEWS.includes(news)) return 'bullish';
    if (BEARISH_NEWS.includes(news)) return 'bearish';
    return 'neutral';
}

module.exports = {
    BULLISH_NEWS,
    BEARISH_NEWS,
    NEUTRAL_NEWS,
    getRandomNews,
    getNewsByType,
    getNewsType
};
