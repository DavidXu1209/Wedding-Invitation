/**
 * 婚礼邀请函 — 可配置内容
 * 业务数据在此维护，页面逻辑读取 CONFIG
 */
const CONFIG = {
  couple: {
    groom: '许超',
    bride: '程昱',
  },

  intro: '',

  wedding: {
    date: '2026-11-16',
    time: '12:00:00',
    timeLabel: '中午 12:00',
    venue: '陶然居',
    hotel: '陶然居大酒店',
    address: '山东省临沂市兰山区陶然路163号',
    entrance: '南门',
    city: '临沂',
    /* 地图 POI 用酒店全称 + 南门，避免搜到外地同名店 */
    mapName: '临沂陶然居大酒店南门',
    /* 高德 GCJ-02：经度,纬度。对应陶然路163号陶然居大酒店 */
    coords: '118.342305,35.039017',
    poiId: '',
    mapUrl: '',
  },

  closing: {
    monogram: 'X & C',
    message: 'Looking forward to celebrating with you',
  },

  timeline: [
    {
      date: '2023-12-08',
      title: 'First Glance',
      caption: '初遇·轨迹交汇的起点',
      photo: 'assets/photos/7bdbbfab505c9f39cfc1f29134bc9ac9.jpg',
      photoAlt: '许超与程昱，初遇的温柔',
      frame: 'glance',
    },
    {
      date: '2023-12-20',
      title: 'Mutual Resonance',
      caption: '共鸣·心意相通的瞬息',
      photo: 'assets/photos/69b726317e5dbdc58b3fa05ded4743fa.jpg',
      photoAlt: '许超与程昱相视牵手',
      frame: 'resonance',
    },
    {
      date: '2025-10-04',
      title: 'The Pledge',
      caption: '许诺·向彼此走近的契约',
      photo: 'assets/photos/1160c7043c0fb8987d4b9e5234488d2c.jpg',
      photoAlt: '程昱走向花廊下的许超',
      stack: true,
    },
    {
      date: '2025-12-18',
      title: 'Boundless Union',
      caption: '结契·法律与爱意的双重署名',
      photo: 'assets/photos/dinghun.jpg',
      photoAlt: '许超与程昱领证',
      frame: 'landscape',
      stack: true,
    },
    {
      date: '2026-11-16',
      title: 'The Celebration',
      caption: '永恒·共赴余生的起点',
      photo: 'assets/photos/2ec70a7c7d7f16f02c6e67c323d47a91.jpg',
      photoAlt: '许超与程昱的婚纱大片',
      stack: true,
      highlight: true,
    },
  ],

  prologue: {
    coverImage: 'assets/photos/cover.jpg',
    knockText: '开启请柬',
    enterText: '开启请柬',
  },

  photos: [
    {
      group: 'Chapter I · 教堂',
      groupZh: '教堂',
      items: [
        {
          src: 'assets/photos/8b81b70f03fd530877fdb9b55d3258b6.jpg',
          alt: '许超与程昱在教堂门前对望',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 72%',
        },
        {
          src: 'assets/photos/ef457547b753a03e7d2482d9ec2d5d31.jpg',
          alt: '许超与程昱在花径中走来',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 58%',
        },
      ],
    },
    {
      group: 'Chapter II · 庄园',
      groupZh: '庄园',
      items: [
        {
          src: 'assets/photos/46ff3947039d60cc15557a9e0659c8e2.jpg',
          alt: '许超与程昱立于石拱门下',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 68%',
        },
        {
          src: 'assets/photos/c1a34b4db0b98307859d691e70529747.jpg',
          alt: '许超与程昱在铁门前轻转',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 58%',
        },
      ],
    },
    {
      group: 'Chapter III · 草坪',
      groupZh: '草坪',
      items: [
        {
          src: 'assets/photos/829d9b2c676f2739ddcb9cce45e1b9ce.jpg',
          alt: '许超与程昱在草坪上微笑',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 36%',
        },
        {
          src: 'assets/photos/2f6f37248014439cf35a04d3859209bb.jpg',
          alt: '许超与程昱立于花瓣草坪',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 72%',
        },
      ],
    },
    {
      group: 'Chapter IV · 窗边',
      groupZh: '窗边',
      items: [
        {
          src: 'assets/photos/3b49517a25631c8e4469d2e05c06f386.jpg',
          alt: '许超与程昱在窗边相依',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 48%',
        },
        {
          src: 'assets/photos/31e675898a0b377d4a0554160bd9c620.jpg',
          alt: '许超与程昱在蓝窗前留影',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
      ],
    },
    {
      group: 'Chapter V · 日常',
      groupZh: '日常',
      items: [
        {
          src: 'assets/photos/37d48802e1c4b509ec164af9de5aaff8.jpg',
          alt: '程昱在冬日果树旁',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/2e4ec2e65679c6ee9d67f6e7964d71ed.jpg',
          alt: '许超与程昱街边的花束合影',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 28%',
        },
        {
          src: 'assets/photos/6b850636f7fd07b3df9c3148a96d7d92.jpg',
          alt: '许超与程昱的红灯合影',
          caption: '',
          ratio: '4 / 3',
          objectFit: 'contain',
          objectPosition: '50% 50%',
        },
        {
          src: 'assets/photos/adc59e85c24fbaab2dc01f3dd180b269.jpg',
          alt: '许超与程昱旅途中的合影',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 40%',
        },
        {
          src: 'assets/photos/f08cfa807c70c1ea02ae327c10130e4c.jpg',
          alt: '许超与程昱冬日出行',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 34%',
        },
      ],
    },
  ],

  guestNotes: {
    enabled: true,
    moderation: true,
    placeholder: {
      name: '留下您的姓名',
      message: '写下对新人的祝福',
    },
    submitText: '送上祝福',
    emptyText: '还没有人留下祝福，等你写下第一句',
    items: [],
  },

  share: {
    title: '许超 & 程昱 · 婚礼邀请函',
    description: '2026.11.16 中午 · 陶然居',
    image: 'assets/share/share.jpg',
    ctaText: '分享给好友 →',
  },

  textures: {
    background: '',
    overlay: '',
  },

  audio: {
    src: 'assets/Jake Miller - Lucky Me.mp3',
    loop: true,
    volume: 0.42,
  },
};
