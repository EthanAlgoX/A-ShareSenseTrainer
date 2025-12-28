# K线猜猜乐 (K-Line Guess Fun)

一个专为 A 股市场设计的盘感训练微信小程序。通过模拟真实历史行情，训练用户的"择时能力"和"空仓定力"。

## 📌 项目特点

- 🎯 **真实数据**：使用真实 A 股历史数据，确保训练的有效性
- 📊 **专业图表**：ECharts 绘制专业 K 线 + 均线 + 成交量
- 🎮 **游戏化设计**：10 关挑战，称号系统，增加趣味性
- 💡 **理念强化**：强化"空仓也是一种操作"的投资理念

## 🎮 游戏规则

- **初始资金**：100,000 元
- **关卡数量**：10 关（每关对应一个交易日决策）
- **操作选择**：
  - 🔴 **全仓买入**：认为明日必涨
  - ⚪ **空仓观望**：持有现金不动

## 🚀 快速开始

### 1. 安装依赖

下载 ECharts for Weixin 组件：

```bash
git clone https://github.com/ecomfe/echarts-for-weixin.git temp_echarts
cp -r temp_echarts/ec-canvas ./ec-canvas
rm -rf temp_echarts
```

### 2. 导入项目

1. 打开微信开发者工具
2. 导入项目目录
3. 修改 `project.config.json` 中的 `appid` 为你的小程序 AppID

### 3. 运行

点击"编译"按钮即可预览

## 📁 项目结构

```
A-ShareSenseTrainer/
├── app.js                 # 小程序入口
├── app.json               # 全局配置
├── app.wxss               # 全局样式
├── project.config.json    # 项目配置
├── data/
│   └── stockData.js       # 股票数据模块
├── ec-canvas/             # ECharts 组件（需手动下载）
├── pages/
│   ├── welcome/           # 欢迎页
│   ├── trading/           # 操盘页（核心）
│   └── result/            # 结算页
├── utils/
│   └── chartHelper.js     # 图表配置工具
└── scripts/
    └── fetch_stock_data.py # 数据获取脚本
```

## 🏆 称号系统

| 称号 | 条件 |
|------|------|
| 🦅 巴菲特分特 | 收益 > 30% |
| 🚀 游资大佬 | 收益 > 20% |
| 📈 稳健理财师 | 收益 0-20% |
| 👑 空仓之王 | 资金变化 < 5% 且空仓 ≥ 7 次 |
| 😅 保本选手 | 亏损 0-10% |
| 🥬 绿油油 | 亏损 10-20% |
| 💸 A股慈善家 | 亏损 > 20% |

## 📈 数据获取

如需获取更多真实数据，可运行 Python 脚本（需安装 adata 库）：

```bash
pip install adata
python scripts/fetch_stock_data.py
```

## 📝 技术栈

- 微信小程序原生开发
- ECharts for Weixin（K 线图表）
- A 股颜色规范（红涨绿跌）

## 📄 License

AGPL 3.0 License - see [LICENSE](LICENSE) file for details

This project is licensed under the GNU Affero General Public License v3.0, which requires that if you modify and deploy this software as a network service, you must make the source code available to users.
