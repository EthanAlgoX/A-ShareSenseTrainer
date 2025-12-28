// pages/trading/trading.js
const app = getApp();
const stockData = require('../../data/stockData.js');
const chartHelper = require('../../utils/chartHelper.js');
const soundHelper = require('../../utils/soundHelper.js');
const newsData = require('../../data/newsData.js');

// 移除全局 echarts 变量，改为在初始化时局部引入，避免渲染实例冲突
const echarts = require('../../ec-canvas/echarts');

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
        ec: {
            lazyLoad: false // 改为自动初始化，由组件触发 init 事件
        },

        // 趣味性增强
        stockQuote: '',
        showAchievement: false,
        achievement: null,

        // Roguelike 元素
        currentTalent: null,
        currentNews: '',
        showBankruptcy: false,

        // 当前关卡数据
        levelData: null
    },

    onLoad() {
        // 开启分享朋友圈功能
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
        this.initGame();
    },

    onUnload() {
        console.info('[Trading] Page Unload, clearing chart instance');
        this.chartInstance = null;
    },

    // 初始化游戏
    initGame() {
        const globalData = app.globalData;
        this.setData({
            currentLevel: globalData.currentLevel,
            totalLevels: globalData.totalLevels,
            currentCapital: globalData.currentCapital,
            capitalDisplay: this.formatMoney(globalData.currentCapital),
            capitalClass: this.getCapitalClass(globalData.currentCapital),
            currentTalent: globalData.talent,
            currentNews: newsData.getRandomNews()
        });

        this.loadLevelData();
    },

    // 加载当前关卡数据
    loadLevelData() {
        const { currentLevel, sessionSeeds } = app.globalData;
        const levelData = stockData.getLevelDataFromSession(sessionSeeds, currentLevel);

        this.setData({
            levelData: levelData,
            stockName: levelData.name
        }, () => {
            // 如果图表已存在，直接更新选项
            if (this.chartInstance && this.data.levelData) {
                this.updateChartData();
            }
        });
    },

    // 图表初始化事件回调
    onChartInit(e) {
        console.info('[Trading] onChartInit received:', e.detail);
        const { canvas, width, height, dpr, echarts: echartsInstance } = e.detail;

        if (!canvas) {
            console.error('[Trading] No canvas provided in init event');
            return;
        }

        this.initChart(canvas, width, height, dpr, echartsInstance);
    },

    // 封装图表数据更新逻辑
    updateChartData() {
        if (!this.chartInstance || !this.data.levelData) return;
        const option = chartHelper.generateChartOption(this.data.levelData.history, false);
        this.chartInstance.setOption(option, true);
    },

    // 初始化图表实例
    initChart(canvas, width, height, dpr, echartsInstance) {
        console.info(`[Trading] Initializing Chart: ${width}x${height} @ ${dpr}dpr`);

        // 优先使用组件传过来的实例，如果没传则兜底使用页面引用的
        const renderEcharts = echartsInstance || echarts;

        try {
            this.chartInstance = renderEcharts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
            });
            console.info('[Trading] ECharts instance created successfully');
            this.updateChartData();
        } catch (err) {
            console.error('[Trading] ECharts init failed:', err);
        }

        return this.chartInstance;
    },

    // 买入操作
    handleBuy() {
        soundHelper.playSound(soundHelper.SOUNDS.BUY);
        this.handleDecision('buy');
    },

    // 观望操作
    handleWait() {
        soundHelper.playSound(soundHelper.SOUNDS.WAIT);
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
        const { levelData, currentCapital, currentTalent } = this.data;
        const answer = levelData.answer;
        const preClose = levelData.history[levelData.history.length - 1].close;

        // 计算原始涨跌幅
        let changePercent = (answer.close - preClose) / preClose;

        // --- 天赋效果应用 ---
        let talentEffectTriggered = false;
        let talentMessage = '';

        // 1. 庄家抬轿：空仓也有收益
        if (choice === 'wait' && currentTalent?.id === 'banker') {
            changePercent = 0.01; // 1% 理财收益
            talentEffectTriggered = true;
            talentMessage = '【庄家抬轿】空仓获得1%收益';
        }

        // 2. 融资融券：盈亏翻倍
        if (choice === 'buy' && currentTalent?.id === 'leverage') {
            changePercent *= 2;
            talentEffectTriggered = true;
            talentMessage = '【融资融券】杠杆生效，盈亏翻倍';
        }

        // 3. 稳健投资：波动减半
        if (choice === 'buy' && currentTalent?.id === 'steady') {
            changePercent *= 0.5;
            talentEffectTriggered = true;
            talentMessage = '【稳健投资】波动减半';
        }

        // 4. 财神附体：首单必胜 (如果是第一关且亏损，强制改为小赚)
        if (app.globalData.currentLevel === 1 && changePercent < 0 && choice === 'buy' && currentTalent?.id === 'lucky') {
            changePercent = 0.02; // 强行改命
            talentEffectTriggered = true;
            talentMessage = '【财神附体】首单强行盈利';
        }

        let changeDisplay = (changePercent * 100).toFixed(2);
        let newCapital = currentCapital;

        // 计算新资金：只有买入操作，或者触发了庄家抬轿天赋的观望才有收益
        if (choice === 'buy' || (choice === 'wait' && currentTalent?.id === 'banker')) {
            newCapital = currentCapital * (1 + changePercent);
        }

        // 5. 停牌重组：防暴跌（亏损超5%回退）
        if (newCapital < currentCapital * 0.95 && currentTalent?.id === 'halt') {
            newCapital = currentCapital;
            changePercent = 0;
            changeDisplay = '0.00';
            talentEffectTriggered = true;
            talentMessage = '【停牌重组】触发熔断，本金无损';
        }

        let resultType = '';
        let resultEmoji = '';
        let resultTitle = '';
        let resultMessage = '';
        let effectClass = '';

        if (choice === 'buy') {
            // 全仓买入
            app.globalData.stats.buyCount++;

            if (changePercent > 0) {
                // 买入盈利
                resultType = 'win';
                resultEmoji = '🎉';
                resultTitle = '吃肉啦！';
                resultMessage = `成功抓住涨幅，收益 ${changeDisplay}%`;

                // 玩梗：大涨特效
                if (changePercent > 0.05) {
                    effectClass = 'effect-gold-rain'; // 金币雨
                    resultTitle = '会所嫩模！';
                    resultEmoji = '🤑';
                } else {
                    effectClass = 'effect-rise';
                }

                app.globalData.stats.winCount++;
            } else if (changePercent < 0) {
                // 买入亏损
                resultType = 'lose';
                resultEmoji = '😭';
                resultTitle = '关灯吃面...';
                resultMessage = `追高被套，亏损 ${Math.abs(changeDisplay)}%`;

                // 玩梗：大跌特效
                if (changePercent < -0.05) {
                    effectClass = 'effect-dark-noodles'; // 关灯吃面
                    resultTitle = '天台排队...';
                    resultEmoji = '🕯️';
                } else {
                    effectClass = 'effect-fall';
                }

                app.globalData.stats.loseCount++;
            } else {
                // 平盘 (可能是停牌重组触发)
                resultType = 'neutral';
                resultEmoji = '🛡️';
                resultTitle = '保住狗命';
                resultMessage = '虽然买入但未亏损';
            }
        } else {
            // 空仓观望
            app.globalData.stats.waitCount++;

            // 重新获取原始涨幅用于判断踏空/躲避 (因为 changePercent 可能被庄家抬轿修改)
            const rawChange = (answer.close - preClose) / preClose;

            if (changePercent > 0 && currentTalent?.id === 'banker') {
                // 庄家抬轿特殊情况
                resultType = 'win';
                resultEmoji = '🎰';
                resultTitle = '躺着赚钱';
                resultMessage = `空仓理财收益 ${changeDisplay}%`;
                effectClass = 'effect-rise';
                app.globalData.stats.winCount++;
            } else if (rawChange < -0.02) {
                // 成功躲避暴跌
                resultType = 'dodge';
                resultEmoji = '😏';
                resultTitle = '神操作！';
                resultMessage = `成功躲过 ${(Math.abs(rawChange) * 100).toFixed(2)}% 的暴跌`;
                effectClass = 'effect-dodge';
                app.globalData.stats.dodgeCount++;
            } else if (rawChange > 0.02) {
                // 踏空
                resultType = 'miss';
                resultEmoji = '😫';
                resultTitle = '拍断大腿！';
                resultMessage = `错过 ${(rawChange * 100).toFixed(2)}% 的大涨`;
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

        // 如果触发了天赋，追加提示
        if (talentEffectTriggered) {
            resultMessage = `${resultMessage}\n(${talentMessage})`;
        }

        // 更新全局资金
        console.info(`[Trading] Level ${app.globalData.currentLevel} End. Choice: ${choice}, Change: ${changeDisplay}%, Capital: ${currentCapital} -> ${newCapital}`);
        app.globalData.currentCapital = newCapital;

        // 记录操作
        app.recordOperation(
            app.globalData.currentLevel,
            choice,
            changePercent,
            newCapital
        );

        // 播放结果音效
        if (resultType === 'win') {
            soundHelper.playSound(soundHelper.SOUNDS.WIN);
        } else if (resultType === 'lose') {
            soundHelper.playSound(soundHelper.SOUNDS.LOSE);
        } else if (resultType === 'dodge') {
            soundHelper.playSound(soundHelper.SOUNDS.DODGE);
        }

        // 更新图表，显示答案
        this.updateChartWithAnswer();

        // 获取随机股市名言
        const quote = soundHelper.getRandomQuote();

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
            effectClass,
            stockQuote: quote
        });

        // 2.5秒后进入下一关
        setTimeout(() => {
            this.nextLevel();
        }, 2500);
    },

    // 更新图表显示答案
    updateChartWithAnswer() {
        if (!this.chartInstance) return;

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

        this.chartInstance.setOption(option);
    },

    // 下一关
    nextLevel() {
        // 破产检测 (资金 < 20000)
        if (app.globalData.currentCapital < 20000) {
            this.handleBankruptcy();
            return;
        }

        const nextLevel = app.globalData.currentLevel + 1;

        if (nextLevel > app.globalData.totalLevels) {
            // 游戏结束
            wx.redirectTo({
                url: '/pages/result/result'
            });
        } else {
            // 进入下一关
            console.info(`[Trading] Level Up: ${app.globalData.currentLevel} -> ${nextLevel}. Current Global Capital: ${app.globalData.currentCapital}`);
            app.globalData.currentLevel = nextLevel;

            this.setData({
                showingResult: false,
                effectClass: '',
                resultAnimation: ''
            });

            this.initGame();
        }
    },

    // 处理破产
    handleBankruptcy() {
        wx.showModal({
            title: '⚠️ 资金链断裂',
            content: '您的资金已不足 2 万元，面临破产清算！\n是否寻找天使投资人进行重组？',
            confirmText: '拉投资',
            cancelText: '放弃',
            success: (res) => {
                if (res.confirm) {
                    // 复活成功
                    app.globalData.currentCapital = 50000; // 恢复到 5万

                    wx.showToast({
                        title: '注资成功！',
                        icon: 'success'
                    });

                    // 播放音效
                    soundHelper.playSound(soundHelper.SOUNDS.LEVEL_UP);

                    // 继续游戏（进入下一关）
                    const nextLevel = app.globalData.currentLevel + 1;
                    if (nextLevel > app.globalData.totalLevels) {
                        wx.redirectTo({ url: '/pages/result/result' });
                    } else {
                        app.globalData.currentLevel = nextLevel;
                        this.setData({
                            showingResult: false,
                            effectClass: '',
                            resultAnimation: ''
                        });
                        this.initGame();
                    }
                } else {
                    // 放弃，直接结算
                    wx.redirectTo({
                        url: '/pages/result/result'
                    });
                }
            }
        });
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
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        const { currentLevel, currentCapital } = app.globalData;
        const profit = ((currentCapital - 100000) / 1000).toFixed(2);
        return {
            title: `【第${currentLevel}关】我在A股觉醒计划博弈，当前收益率 ${profit}%！`,
            path: '/pages/welcome/welcome'
        };
    },

    /**
     * 分享到朋友圈
     */
    onShareTimeline() {
        const { currentLevel } = app.globalData;
        return {
            title: `股神养成记：博弈第 ${currentLevel} 关，风险是存在的唯一意义。`,
            query: 'from=timeline'
        };
    }
});
