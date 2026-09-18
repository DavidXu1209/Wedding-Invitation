# 视觉规范

## 视觉方向

**法式复古（French Vintage / Châteaux Style）· 经典庄园 · 高级克制**

关键词：优雅、克制、复古、真实、庄园感。

参考：法式庄园婚礼请柬、欧洲古典室内线板（Boiserie）、复古火漆封缄。

## 明确禁止

### 视觉元素

- 宣纸白、朱砂红、中式印章（已剔除）
- 大红婚庆风、大面积中国红
- 龙凤、灯笼、喜字铺满、传统婚庆模板
- 金色渐变、金箔铺满、婚庆商城风按钮
- 婚庆翻牌倒计时

### 图片处理

- AI 重绘新人面貌
- 改变脸部、五官、服装、姿态
- 虚构不存在的场景

### 动效

- 过度动画：爆炸、弹跳、粒子雨、金色特效
- 弹幕、直播气泡、横向飞行祝福

## 照片处理原则

红线以 `.cursor/rules/04-photo.mdc` 为准，本文档不放宽。

保留真实婚纱照人物身份。

**允许：** 裁切 · 调色 · 排版 · 纹理叠加 · 光影优化
**禁止：** 改变脸部、服装、姿态 · AI 重绘/换脸

| 文件 | 用途 |
|------|------|
| `cover.jpg` | Cover、Share Poster |
| `story-01.jpg` | Gallery · 誓言 |
| `story-02.jpg` | Gallery · 誓约 |

## 色彩系统

| 角色 | 变量 | 色值 | 用途 |
|------|------|------|------|
| French Cream | `--color-cream` | `#FAF9F6` | 主背景（法式奶油白） |
| Charcoal | `--color-charcoal` | `#2C2C2C` | 核心正文与标题 |
| Champagne Gold | `--color-accent-gold` | `#D4AF37` | 点缀 |
| Burgundy | `--color-accent-burgundy` | `#800020` | 点缀 |

中性层级由 Charcoal 派生，不引入额外品牌色：

| 变量 | 取值 | 用途 |
|------|------|------|
| `--color-muted` | `rgba(44,44,44,0.52)` | 标注、次要文字 |
| `--color-hairline` | `rgba(44,44,44,0.14)` | 细线、分隔、Boiserie 线框 |

**点缀色限制：**

- 香槟金与勃艮第酒红只用于火漆印、细线、边框装饰、落款
- 单页内点缀色总面积 < 5%
- 不作背景色或大面积色块
- 同一页优先只选其一，两色不同时大面积并用

CSS 变量定义于 `css/style.css`。

## 字体

| 用途 | 变量 | 字体栈 |
|------|------|--------|
| 大标题（姓名、日期、核心短语） | `--font-display` | `'Playfair Display', 'Cormorant Garamond', Didot, serif` |
| 正文与标注 | `--font-body` | `'Jost', 'Montserrat', 'Helvetica Neue', system-ui, sans-serif` |

- 不限定宋体；中文标题可用细体衬线，正文优先无衬线细体
- 字重保持 200–400，避免粗体
- 字体经 `index.html` 引入 Google Fonts

## 字间距

| 变量 | 取值 | 用途 |
|------|------|------|
| `--tracking-display` | `0.42em` | 姓名等大标题 |
| `--tracking-title` | `0.24em` | 章节标题 |
| `--tracking-label` | `0.3em` | 标注、CTA |
| `--tracking-body` | `0.08em` | 正文 |

大标题字间距区间：**0.2em – 0.5em**。

## 字号层级

| 层级 | 大小 | 用途 |
|------|------|------|
| 大标题 | ≤ 32px | 姓名、日期数字 |
| 章节标题 | 12–16px | 章节名 |
| 正文 | 11–13px | 简介、事件、地址 |
| 标注 | 9–10px | 年份、CTA、页脚 |

## 排版原则

- 大图优先
- 小字号文字
- **极端留白**：单屏留白 ≥ 50%
- **非对称呼吸感**：避免全部居中，主动使用偏移与单侧留白
- **字小于图，留白大于字**

## 视觉符号

### Monogram 火漆印

- 新人首字母交织：**X & C**（许超 / 程昱）
- 形式：法式复古火漆印（Wax Seal）质感，圆形封缄
- 配色：Champagne Gold 或 Burgundy，尺寸 ≤ 40px
- 位置：封面落款、章节末尾、分享海报落款
- 禁止中式印章、朱砂方印

### French Boiserie 线框

- 极简法式石膏线框：细线矩形 + 四角内收折角
- 线宽 1px，色值 `--color-hairline` 或低透明度 Champagne Gold
- 用于章节边缘、照片外框、信息区包框
- 禁止繁复雕花与巴洛克花纹堆叠

## 章节分隔

- 章节标题用 `--font-display` + `--tracking-title`
- 分隔为 `--color-hairline` 细线，长度 40–48px
- 章节间距 64–96px，以留白与细线完成过渡，不做色块切换

## 各页视觉要点

| 页面 | 要点 |
|------|------|
| Cover | 全 bleed `cover.jpg` 占屏 85%+，底部奶油白过渡带内放姓名与日期，文字链 CTA，可置 monogram 落款 |
| Couple | French Cream 纯排版，衬线姓名 + 无衬线简介，非对称左对齐 |
| Wedding Details | 杂志式信息页，衬线大号日期，静态装饰感倒计时，文字链导航 |
| Our Story | 年份分组时间线，左对齐 + 右侧大留白，婚礼节点用点缀色细线标记 |
| Gallery | 4:5 / 3:4 大图，两图不同排版节奏，可选 Boiserie 细线外框 |
| Guest Notes | 高级法式签名册，连续纸面笔迹排列，禁止卡片列表 |
| Share Poster | cover 裁切 + 姓名 + 日期 + 酒店 + monogram 落款 + 分享 meta 素材 |
