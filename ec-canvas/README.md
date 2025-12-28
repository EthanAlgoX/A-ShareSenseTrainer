# ECharts for WeChat 组件

## 安装说明

此目录需要手动下载 ECharts for Weixin 组件。

### 步骤：

1. 前往 GitHub 下载 ec-canvas 组件：
   https://github.com/ecomfe/echarts-for-weixin

2. 下载后，将 `ec-canvas` 文件夹复制到此项目根目录

3. 确保目录结构如下：
   ```
   A-ShareSenseTrainer/
   ├── ec-canvas/
   │   ├── ec-canvas.js
   │   ├── ec-canvas.json
   │   ├── ec-canvas.wxml
   │   ├── ec-canvas.wxss
   │   └── echarts.js
   ├── pages/
   ├── data/
   └── ...
   ```

4. 重新编译小程序即可

## 快速下载

可以直接运行以下命令下载（需要 git）：

```bash
git clone https://github.com/ecomfe/echarts-for-weixin.git temp_echarts
cp -r temp_echarts/ec-canvas ./ec-canvas
rm -rf temp_echarts
```

或者手动下载 ZIP 包并解压。
