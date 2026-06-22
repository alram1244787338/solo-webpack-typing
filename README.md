# 打字竞速

随机文章打字测试，实时 WPM 和准确率统计，计时模式，支持退格修改。

## 技术栈

- **webpack 5** — 构建 & 开发服务器
- **原生 JavaScript (ES Module)** — 无框架，纯 DOM 操作
- **自建 test runner** — 手写 describe / it / expect，零依赖测试

## 目录结构

```
├── public/
│   └── index.html              # HTML 模板
├── src/
│   ├── components/
│   │   ├── App.js               # 主应用组件（核心编排逻辑）
│   │   ├── Header.js            # 头部 & 底部
│   │   ├── StatsBar.js          # 实时统计栏（WPM / 准确率 / 时间 / 字符）
│   │   ├── TypingArea.js        # 打字区域（原文展示 + 隐藏输入框 + 滚动跟随）
│   │   └── ResultModal.js       # 成绩弹窗
│   ├── data/
│   │   └── articles.js          # 5 篇预置英文文章
│   ├── styles/
│   │   ├── global.css           # 全局重置 & 字体
│   │   ├── layout.css           # 页面布局
│   │   └── typing.css           # 打字区域 & 弹窗样式
│   ├── utils/
│   │   ├── articleLoader.js      # 文章随机加载 & 按 ID 查询
│   │   ├── stats.js             # WPM / 准确率 / 时间格式化计算
│   │   └── timer.js              # 基于 Date.now 的倒计时器
│   └── index.js                 # 入口文件
├── test/
│   ├── runner.mjs               # 自建测试框架（describe / it / expect）
│   ├── run.mjs                  # 测试入口
│   ├── stats.test.mjs           # 统计计算测试（18 用例）
│   ├── articleLoader.test.mjs   # 文章加载测试（11 用例）
│   └── timer.test.mjs           # 计时器测试（16 用例）
├── webpack.common.cjs           # webpack 公共配置
├── webpack.dev.cjs              # webpack 开发配置
├── webpack.prod.cjs             # webpack 生产配置
└── package.json
```

## 安装运行

```bash
npm install
npm run dev
```

浏览器自动打开 `http://localhost:8081`，即可开始打字。

其他命令：

```bash
npm run build    # 生产构建，输出到 dist/
npm test         # 运行测试
```

## 怎么玩

1. 页面加载后，随机英文文章显示在打字区域
2. 点击打字区域或按任意字母键，计时自动开始（60 秒倒计时）
3. 按原文逐字输入：
   - **绿色** = 正确
   - **红色** = 错误
   - **蓝色闪烁光标** = 当前位置
4. 按 **Backspace** 可以退格修改，之前标记的颜色会恢复为未输入状态
5. 打字过程中顶部实时显示 WPM、准确率、剩余时间
6. 60 秒到或打完全文后自动停止，弹出成绩面板
7. 点击「换一篇文章」切换随机文章，点击「重新开始」重置当前文章

## 测试

```bash
npm test
```

45 个用例，覆盖三个核心模块：

| 模块 | 用例数 | 测试内容 |
|------|--------|----------|
| **stats.js** | 18 | WPM 计算（60s / 30s / 0s 边界）、准确率（全对 / 半错 / 全错 / 0字符）、formatTime、calculateStats 综合场景 |
| **articleLoader.js** | 11 | 文章数量、独立拷贝、字段完整性、随机返回、按 ID 查询（存在 / 不存在 / 负数 / 0） |
| **timer.js** | 16 | 构造初始值、reset / setDuration、100ms 真实计时、stop 后不增长、isRunning 状态、onTick / onComplete 回调、暂停续计时间延续 |
