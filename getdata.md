根据您提供的项目文件 `adata`（AData），这是一个专注于 A 股交易数据的 Python 开源库。

以下是基于 `README.md` 文件整理的 **A 股数据获取指南**：

### 1. 安装环境

首先需要安装 `adata` 库：

```bash
pip install adata
# 或者使用国内镜像加速
pip install adata -i http://mirrors.aliyun.com/pypi/simple/

```

### 2. 获取股票代码

获取 A 股所有股票的基本信息（包括代码、简称、交易所等）：

```python
import adata

# 获取所有股票代码
res_df = adata.stock.info.all_code()
print(res_df)

```

### 3. 获取历史行情数据 (K线)

获取指定股票的日线、周线或月线数据：

```python
import adata

# k_type: k线类型：1.日；2.周；3.月 默认：1 日k
# start_date: 开始日期
df = adata.stock.market.get_market(stock_code='000001', k_type=1, start_date='2021-01-01')
print(df)

```

### 4. 获取实时行情数据

获取当前的最新行情、五档行情或分笔成交：

```python
import adata

# 1. 批量获取最新行情（数据源：新浪/腾讯）
# list_market_current 接口支持传入代码列表
current_df = adata.stock.market.list_market_current(code_list=['000001', '600001'])

# 2. 获取单个股票的当日分时行情
min_df = adata.stock.market.get_market_min(stock_code='000001')

# 3. 获取五档行情（数据源：腾讯/百度）
five_df = adata.stock.market.get_market_five(stock_code='000001')

```

### 5. 获取其他重要数据

`adata` 还支持获取指数、概念板块、资金流向等数据：

* **指数代码与行情**：
```python
# 获取所有指数代码
adata.stock.info.all_index_code()
# 获取指数行情
adata.stock.market.get_market_index(index_code='000001', k_type=1)

```


* **概念板块（同花顺/东方财富）**：
```python
# 获取同花顺概念成分股
adata.stock.info.concept_constituent_ths()
# 获取概念资金流向（东方财富）
adata.stock.market.all_capital_flow_east()

```


* **资金流向**：
```python
# 获取个股资金流向（历史日度）
adata.stock.market.get_capital_flow(stock_code='000001')

```



### 6. 数据源说明

该库的数据主要来源于以下主要平台，为了保证高可用性，采用了多数据源融合切换：

* 同花顺（数据中心、行情中心）
* 百度股市通
* 东方财富（数据中心）
* 腾讯理财
* 新浪财经

### 7. 代理设置 (可选)

如果遇到接口限制，可以设置代理 IP：

```python
import adata
# ip 和 proxy_url 二选一
adata.proxy(is_proxy=True, ip='60.167.21.27:1133')

```