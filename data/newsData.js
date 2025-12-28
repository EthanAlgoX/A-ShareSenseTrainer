/**
 * newsData.js - 小道消息数据
 * 用于干扰用户判断，增加游戏趣味性
 */

// 利好消息（通常暗示看涨）
const BULLISH_NEWS = [
    "🔥 传闻：某知名游资大佬已入驻，准备打造真妖股",
    "📈 研报：行业逻辑重构，核心资产给予'天际'评级",
    "💰 公告：实控人承诺不减持，并自掏腰包暴力回购",
    "🚀 消息：黑科技产品获国家级突破，订单排到明年",
    "👔 独家：神秘中东土豪团现身调研，满脸写着'有钱'",
    "📊 数据：北向资金开启'抄家'模式，连续10日吸筹",
    "🔥 爆料：即将剥离亏损资产，迎来史诗级重组",
    "💎 内幕：第二增长曲线已激活，估值模型需重写"
];

// 利空消息（通常暗示看跌）
const BEARISH_NEWS = [
    "⚠️ 突发：董事长因‘玄学原因’导致离婚，股份面临分割",
    "📉 警报：大股东精准套现，减持比例高达5.99%",
    "🔴 炸雷：财务总监由于‘压力过大’已失联3天",
    "💸 公告：业绩预告出现‘季节性亏损’，降幅99.9%",
    "😰 传闻：核心团队被友商整锅端走，只剩下保安",
    "📰 报道：行业进入‘冰河期’，公司面临降维打击",
    "⛔ 风险：原材料涨价10倍，生产线已开启‘省电模式’",
    "🚨 突发：某小作文在圈内流传，证监会连夜问询"
];

// 中性/段子消息（娱乐向，不影响判断）
const NEUTRAL_NEWS = [
    "💬 老乡别走，这就是一次简单的‘温柔洗盘’！",
    "🤔 股评：这波不亏，我们是技术性调整（物理意义上）",
    "😅 股友：天台的风很大，但我一定要等一个奇迹",
    "🎭 专家：股市是认知的变现，我认知大概是负数",
    "🍜 热评：灯已经关了，面很好吃，泪水很咸",
    "🎪 主力：我没走，我只是在深蹲，为了跳得更高",
    "🎨 警示：如果您不看账户，其实您并没亏钱",
    "💡 语录：空仓也是一种战斗，我们称之为‘战略保存’",
    "🎲 玄学：今日开盘吉时已过，宜关软件，忌看盘",
    "🎨 吐槽：A股这辈子，全靠这口‘盘感’在撑着"
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
