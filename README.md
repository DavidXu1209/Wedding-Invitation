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

祝福要让所有亲友看见时，请用同站祝福簿启动（静态目录 + `/api/wishes`）：

```bash
npm start
```

浏览器打开 `http://localhost:3456`。部署到任意能跑 Node 的主机后，亲友打开同一地址即可互见祝福。

只看页面、不需要互相看见时，也可以直接打开 `index.html`，或：

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
