# WordCards 项目

一个简洁好用的单词卡片记忆应用。

## 功能特点

- 📚 创建和管理多个卡片组
- 🃏 翻转卡片学习
- 📊 追踪学习进度
- 🌙 深色/浅色主题
- 🌍 多语言支持
- 💾 数据导出/导入备份

## 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- Tailwind CSS（UI框架）
- Capacitor（跨平台打包）

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npx http-server www -p 8080
```

## 构建 APK

### 方式1：GitHub Actions（推荐）

1. 将代码推送到 GitHub 仓库
2. 前往 Actions 查看构建进度
3. 下载生成的 APK

### 方式2：本地构建

需要安装：
- Node.js
- Android Studio
- Java JDK 17

```bash
npm install
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

## 项目结构

```
word-cards/
├── www/                 # 前端代码
│   ├── index.html       # 主页面
│   ├── css/             # 样式
│   └── js/              # JavaScript
├── android/             # Android 原生项目
├── docs/                # PRD文档
├── .github/             # GitHub Actions
└── package.json
```

## 许可证

MIT
