// pages/trading/trading.js
const app = getApp();
const stockData = require('../../data/stockData.js');
const chartHelper = require('../../utils/chartHelper.js');

let chart = null;
let echarts = null; // 将从 ec-canvas 组件获取

Page({
    data: {
        currentLevel: 1,
        totalLevels: 10,
        currentCapital: 100000,
        capitalDisplay: '100,000.00',
        capitalClass: '',
        stockName: '',
        isProcessing: false,
        showingResult: false,
        resultType: '',
        resultEmoji: '',
        resultTitle: '',
        resultChangeText: '',
        resultChangeClass: '',
        resultMessage: '',
        resultAnimation: '',
        effectClass: '',
        ec: { onInit: null },

        // 当前关卡数据
        levelData: null
    },

    onLoad() {
        this.initGame();
    },

    onUnload() {
        chart = null;
    },

    // 初始化游戏
    initGame() {
        const globalData = app.globalData;
        this.setData({
            currentLevel: globalData.currentLevel,
            totalLevels: globalData.totalLevels,
            currentCapital: globalData.currentCapital,
            capitalDisplay: this.formatMoney(globalData.currentCapital),
            capitalClass: this.getCapitalClass(globalData.currentCapital)
        });

        this.loadLevelData();
    },

    // 加载当前关卡数据
    loadLevelData() {
        const levelIndex = app.globalData.currentLevel - 1;
        const levelData = stockData.getLevelData(levelIndex);

        this.setData({
            levelData: levelData,
            stockName: levelData.name,
            ec: {
                onInit: (canvas, width, height, dpr) => {
                    return this.initChart(canvas, width, height, dpr);
                }
            }
        });
    },

    // 初始化图表
    initChart(canvas, width, height, dpr) {
        // 懒加载 echarts
        if (!echarts) {
            echarts = require('../../ec-canvas/echarts');
        }

        chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
        });

        const option = chartHelper.generateChartOption(this.data.levelData.history, false);
        chart.setOption(option);

        return chart;
    },

    // 买入操作
    handleBuy() {
        this.handleDecision('buy');
    },

    // 观望操作
    handleWait() {
        this.handleDecision('wait');
    },

    // 核心决策处理
    handleDecision(choice) {
        if (this.data.isProcessing) return;

        wx.vibrateShort({ type: 'medium' });

        this.setData({ isProcessing: true });

        // 模拟加载延迟，营造紧张感
        setTimeout(() => {
            this.revealResult(choice);
        }, 800);
    },

    // 揭晓结果
    revealResult(choice) {
        const { levelData, currentCapital } = this.data;
        const answer = levelData.answer;
        const preClose = levelData.history[levelData.history.length - 1].close;

        // 计算涨跌幅
        const changePercent = (answer.close - preClose) / preClose;
        const changeDisplay = (changePercent * 100).toFixed(2);

        let newCapital = currentCapital;
        let resultType = '';
        let resultEmoji = '';
        let resultTitle = '';
        let resultMessage = '';
        let effectClass = '';

        if (choice === 'buy') {
            // 全仓买入
            newCapital = currentCapital * (1 + changePercent);
            app.globalData.stats.buyCount++;

            if (changePercent > 0) {
                // 买入盈利
                resultType = 'win';
                resultEmoji = '🎉';
                resultTitle = '吃肉啦！';
                resultMessage = `成功抓住涨幅，收益 ${changeDisplay}%`;
                effectClass = 'effect-rise';
                app.globalData.stats.winCount++;
            } else {
                // 买入亏损
                resultType = 'lose';
                resultEmoji = '😭';
                resultTitle = '关灯吃面...';
                resultMessage = `追高被套，亏损 ${Math.abs(changeDisplay)}%`;
                effectClass = 'effect-fall';
                app.globalData.stats.loseCount++;
            }
        } else {
            // 空仓观望
            app.globalData.stats.waitCount++;

            if (changePercent < -0.02) {
                // 成功躲避暴跌
                resultType = 'dodge';
                resultEmoji = '🛡️';
                resultTitle = '神操作！';
                resultMessage = `成功躲过 ${Math.abs(changeDisplay)}% 的暴跌`;
                effectClass = 'effect-dodge';
                app.globalData.stats.dodgeCount++;
            } else if (changePercent > 0.02) {
                // 踏空
                resultType = 'miss';
                resultEmoji = '😫';
                resultTitle = '踏空了！';
                resultMessage = `错过 ${changeDisplay}% 的大涨，大腿拍断`;
                effectClass = '';
                app.globalData.stats.missCount++;
            } else {
                // 平淡行情
                resultType = 'neutral';
                resultEmoji = '😐';
                resultTitle = '稳住';
                resultMessage = '行情平淡，空仓是明智之选';
                effectClass = '';
            }
        }

        // 更新全局资金
        app.globalData.currentCapital = newCapital;

        // 记录操作
        app.recordOperation(
            app.globalData.currentLevel,
            choice,
            changePercent,
            newCapital
        );

        // 更新图表，显示答案
        this.updateChartWithAnswer();

        // 显示结果
        this.setData({
            isProcessing: false,
            showingResult: true,
            currentCapital: newCapital,
            capitalDisplay: this.formatMoney(newCapital),
            capitalClass: this.getCapitalClass(newCapital),
            resultType,
            resultEmoji,
            resultTitle,
            resultChangeText: `${changePercent >= 0 ? '+' : ''}${changeDisplay}%`,
            resultChangeClass: changePercent >= 0 ? 'rise' : 'fall',
            resultMessage,
            resultAnimation: 'animate-fadeIn',
            effectClass
        });

        // 2.5秒后进入下一关
        setTimeout(() => {
            this.nextLevel();
        }, 2500);
    },

    // 更新图表显示答案
    updateChartWithAnswer() {
        if (!chart) return;

        const fullData = [...this.data.levelData.history, this.data.levelData.answer];
        const option = chartHelper.generateChartOption(fullData, true);

        // 高亮第61天
        option.series[0].markPoint = {
            symbol: 'pin',
            symbolSize: 40,
            data: [{
                name: '今日',
                coord: [60, this.data.levelData.answer.close],
                value: '答案',
                itemStyle: { color: '#ffd700' }
            }]
        };

        chart.setOption(option);
    },

    // 下一关
    nextLevel() {
        const nextLevel = app.globalData.currentLevel + 1;

        if (nextLevel > app.globalData.totalLevels) {
            // 游戏结束
            wx.redirectTo({
                url: '/pages/result/result'
            });
        } else {
            // 进入下一关
            app.globalData.currentLevel = nextLevel;

            this.setData({
                showingResult: false,
                effectClass: '',
                resultAnimation: ''
            });

            this.initGame();
        }
    },

    // 格式化金额
    formatMoney(amount) {
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // 获取资金样式类
    getCapitalClass(amount) {
        const initial = app.globalData.initialCapital;
        if (amount > initial * 1.05) return 'capital-up';
        if (amount < initial * 0.95) return 'capital-down';
        return '';
    }
});
