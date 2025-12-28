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
        animationDuration: 500,

        // 图例
        legend: {
            show: true,
            top: 10,
            left: 'center',
            textStyle: { color: COLORS.text, fontSize: 10 },
            data: ['MA5', 'MA10', 'MA20'],
            itemWidth: 14,
            itemHeight: 2
        },

        // 提示框
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            backgroundColor: 'rgba(26, 26, 46, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textStyle: { color: '#fff', fontSize: 11 },
            formatter: function (params) {
                const kline = params.find(p => p.seriesName === 'K线');
                if (!kline) return '';
                const [open, close, low, high] = kline.data;
                const change = ((close - open) / open * 100).toFixed(2);
                const color = close >= open ? COLORS.rise : COLORS.fall;
                return `<div style="line-height:1.6">
          <div>${kline.axisValue}</div>
          <div>开: ${open} 高: ${high}</div>
          <div>收: ${close} 低: ${low}</div>
          <div style="color:${color}">涨跌: ${change}%</div>
        </div>`;
            }
        },

        // 缩放控制
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 0,
                end: 100,
                zoomLock: false,
                moveOnMouseWheel: true
            },
            {
                type: 'slider',
                xAxisIndex: [0, 1],
                start: 0,
                end: 100,
                height: 20,
                bottom: 5,
                borderColor: 'transparent',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fillerColor: 'rgba(239, 35, 42, 0.2)',
                handleStyle: { color: COLORS.rise },
                textStyle: { color: COLORS.text },
                brushSelect: false
            }
        ],

        // 网格布局
        grid: [
            { left: 35, right: 10, top: 40, height: '60%' },    // K线区 - 增加高度，减少左右边距
            { left: 35, right: 10, top: '75%', height: '15%' }  // 成交量区
        ],

        // X轴
        xAxis: [
            {
                type: 'category',
                data: dates,
                gridIndex: 0,
                axisLine: { lineStyle: { color: COLORS.axis } },
                axisLabel: { color: COLORS.text, fontSize: 9 },
                axisTick: { show: false },
                splitLine: { show: false }
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
                splitLine: { lineStyle: { color: COLORS.grid } }
            }
        ],

        // 数据系列
        series: [
            // K线
            {
                name: 'K线',
                type: 'candlestick',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: ohlc,
                itemStyle: {
                    color: COLORS.rise,        // 阳线填充
                    color0: COLORS.fall,       // 阴线填充
                    borderColor: COLORS.rise,  // 阳线边框
                    borderColor0: COLORS.fall  // 阴线边框
                }
            },
            // MA5
            {
                name: 'MA5',
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: ma5,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 1, color: COLORS.ma5 }
            },
            // MA10
            {
                name: 'MA10',
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: ma10,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 1, color: COLORS.ma10 }
            },
            // MA20
            {
                name: 'MA20',
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: ma20,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 1, color: COLORS.ma20 }
            },
            // 成交量
            {
                name: '成交量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes.map((v, i) => ({
                    value: v,
                    itemStyle: { color: volumeColors[i] }
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
