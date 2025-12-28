// app.js
App({
  globalData: {
    // 初始本金
    initialCapital: 100000,
    // 当前资金
    currentCapital: 100000,
    // 当前关卡 (1-10)
    currentLevel: 1,
    // 总关卡数
    totalLevels: 10,
    // 当前 Session 的随机种子序列 (每次重置游戏都会重新生成)
    sessionSeeds: [],
    // 当前天赋
    talent: null,
    // 操作历史记录
    operations: [],
    // 统计数据
    stats: {
      buyCount: 0,      // 买入次数
      waitCount: 0,     // 空仓次数
      winCount: 0,      // 盈利次数
      loseCount: 0,     // 亏损次数
      dodgeCount: 0,    // 成功躲避暴跌次数
      missCount: 0      // 踏空次数
    }
  },

  onLaunch() {
    console.log('股神养成记启动');
    this.resetGame(); // 初始化第一轮种子
  },

  // 重置游戏 (生成新的随机序列)
  resetGame() {
    this.globalData.currentCapital = this.globalData.initialCapital;
    this.globalData.currentLevel = 1;
    this.globalData.operations = [];
    this.globalData.stats = {
      buyCount: 0,
      waitCount: 0,
      winCount: 0,
      loseCount: 0,
      dodgeCount: 0,
      missCount: 0
    };

    // 从 1000 个题库中随机抽取 10 个种子且不重复
    const allSeeds = Array.from({ length: 1000 }, (_, i) => i);
    const shuffled = allSeeds.sort(() => 0.5 - Math.random());
    this.globalData.sessionSeeds = shuffled.slice(0, 10);

    console.log('Session Seeds Generated:', this.globalData.sessionSeeds);
  },

  // 记录操作
  recordOperation(level, choice, changePercent, capitalAfter) {
    this.globalData.operations.push({
      level,
      choice,
      changePercent,
      capitalAfter,
      timestamp: Date.now()
    });
  }
});
