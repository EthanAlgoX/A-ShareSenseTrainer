/**
 * chartHelper.js - ECharts 配置工具
 * 用于生成 A 股风格的 K 线图配置
 */

// A股颜色规范 (Neon Cyber-Finance)
const COLORS = {
    rise: '#FF4D4D',    // 涨 - 霓虹红
    fall: '#00E676',    // 跌 - 霓虹绿
    ma5: '#FFD700',     // MA5 - 金色
    ma10: '#00F0FF',    // MA10 - 科技蓝
    ma20: '#9b5de5',    // MA20 - 紫色
    grid: 'rgba(255, 255, 255, 0.05)',
    text: 'rgba(255, 255, 255, 0.6)',
    axis: 'rgba(255, 255, 255, 0.1)'
};

/**
 * 计算移动平均线
 */
function calculateMA(data, period) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push('-');
        } else {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            result.push((sum / period).toFixed(2));
        }
    }
    return result;
}

/**
 * 生成 ECharts K 线图配置
 */
function generateChartOption(data, showAnswer = false) {
    const displayData = showAnswer ? data : data.slice(0, 60);

    // 准备数据
    const dates = displayData.map(d => d.date.slice(5)); // 只显示 MM-DD
    const ohlc = displayData.map(d => [d.open, d.close, d.low, d.high]);
    const volumes = displayData.map(d => d.volume);

    // 计算均线
    const ma5 = calculateMA(displayData, 5);
    const ma10 = calculateMA(displayData, 10);
    const ma20 = calculateMA(displayData, 20);

    // 成交量颜色
    const volumeColors = displayData.map(d => d.close >= d.open ? COLORS.rise : COLORS.fall);

    return {
        backgroundColor: 'transparent',
        animation: true,
        animationDuration: 800,
        animationEasing: 'exponentialOut',

        // 图例
        legend: {
            show: true,
            top: 5,
            left: 'center',
            textStyle: { color: COLORS.text, fontSize: 10 },
            data: ['MA5', 'MA10', 'MA20'],
            itemWidth: 10,
            itemHeight: 2
        },

        // 提示框
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: { color: 'rgba(255, 215, 0, 0.3)', width: 1, type: 'dashed' }
            },
            backgroundColor: 'rgba(11, 11, 21, 0.95)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
            borderWidth: 1,
            textStyle: { color: '#fff', fontSize: 11 },
            padding: 10,
            formatter: function (params) {
                const kline = params.find(p => p.seriesName === 'K线');
                if (!kline) return '';
                const [open, close, low, high] = kline.data;
                const change = ((close - open) / open * 100).toFixed(2);
                const color = close >= open ? COLORS.rise : COLORS.fall;
                return `<div style="line-height:1.6">
          <div style="color:rgba(255,255,255,0.5);margin-bottom:4px">${kline.axisValue}</div>
          <div style="display:flex;justify-content:space-between;width:120px"><span>开盘</span><span>${open}</span></div>
          <div style="display:flex;justify-content:space-between;width:120px"><span>收盘</span><span>${close}</span></div>
          <div style="display:flex;justify-content:space-between;width:120px;color:${color}"><span>涨跌</span><span>${change}%</span></div>
        </div>`;
            }
        },

        // 缩放控制
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 0,
                end: 100
            }
        ],

        // 网格布局
        grid: [
            { left: 45, right: 15, top: 40, height: '55%' },
            { left: 45, right: 15, top: '75%', height: '15%' }
        ],

        // X轴
        xAxis: [
            {
                type: 'category',
                data: dates,
                gridIndex: 0,
                axisLine: { lineStyle: { color: COLORS.axis } },
                axisLabel: { color: COLORS.text, fontSize: 9, margin: 10 },
                axisTick: { show: false },
                splitLine: { show: true, lineStyle: { color: COLORS.grid, type: 'dashed' } }
            },
            {
                type: 'category',
                data: dates,
                gridIndex: 1,
                axisLine: { lineStyle: { color: COLORS.axis } },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }
        ],

        // Y轴
        yAxis: [
            {
                type: 'value',
                gridIndex: 0,
                scale: true,
                splitNumber: 4,
                axisLine: { show: false },
                axisLabel: { color: COLORS.text, fontSize: 9 },
                splitLine: { lineStyle: { color: COLORS.grid } }
            },
            {
                type: 'value',
                gridIndex: 1,
                scale: true,
                splitNumber: 2,
                axisLine: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            }
        ],

        // 数据系列
        series: [
            // K线 (带有霓虹发光效果)
            {
                name: 'K线',
                type: 'candlestick',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: ohlc,
                itemStyle: {
                    color: COLORS.rise,
                    color0: COLORS.fall,
                    borderColor: COLORS.rise,
                    borderColor0: COLORS.fall,
                    // 极致优化：增加霓虹辉光
                    shadowBlur: 5,
                    shadowColor: 'rgba(0,0,0,0.5)'
                }
            },
            // MA5
            {
                name: 'MA5',
                type: 'line',
                data: ma5,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 1.5, color: COLORS.ma5, opacity: 0.8 }
            },
            // MA10
            {
                name: 'MA10',
                type: 'line',
                data: ma10,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 1.5, color: COLORS.ma10, opacity: 0.8 }
            },
            // MA20
            {
                name: 'MA20',
                type: 'line',
                data: ma20,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 1.5, color: COLORS.ma20, opacity: 0.8 }
            },
            // 成交量
            {
                name: '成交量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes.map((v, i) => ({
                    value: v,
                    itemStyle: {
                        color: volumeColors[i],
                        opacity: 0.6
                    }
                }))
            }
        ]
    };
}

module.exports = {
    COLORS,
    calculateMA,
    generateChartOption
};
