# 婚礼邀请函

电子婚礼邀请函，纯静态 HTML/CSS/JS，支持移动端与微信分享。

## 项目结构

```
wedding-invitation/
├── .cursor/rules/     # Cursor AI 规则
├── css/               # 样式
├── js/                # 脚本与配置
├── index.html         # 入口页面
└── README.md
```

## 本地预览

直接用浏览器打开 `index.html`，或使用本地静态服务器：

```bash
npx serve .
```

## 配置

编辑 `js/config.js` 修改新人信息、婚礼详情、分享文案与照片列表。

## 开发状态

- [x] 项目骨架初始化
- [ ] 页面结构与样式
- [ ] 照片轮播
- [ ] 微信分享优化

## 部署

可部署至任意静态托管（GitHub Pages、Vercel、对象存储等），确保资源使用相对路径。
