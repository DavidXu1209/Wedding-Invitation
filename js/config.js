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
    time: '',
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
      photo: 'assets/photos/story-01.jpg',
      photoAlt: '许超与程昱在花拱下',
      frame: 'arch',
    },
    {
      date: '2025-12-18',
      title: 'Boundless Union',
      caption: '结契·法律与爱意的双重署名',
      photo: 'assets/photos/story-02.jpg',
      photoAlt: '许超与程昱在草地挥手',
      frame: 'ring',
    },
    {
      date: '2026-11-16',
      title: 'The Celebration',
      caption: '永恒·共赴余生的起点',
      photo: 'assets/photos/2ec70a7c7d7f16f02c6e67c323d47a91.jpg',
      photoAlt: '许超与程昱的婚纱大片',
      frame: 'celebration',
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
      group: 'Chapter I · 初遇',
      groupZh: '初遇',
      date: '2023-12-08',
      items: [
        {
          src: 'assets/photos/7bdbbfab505c9f39cfc1f29134bc9ac9.jpg',
          alt: '许超与程昱，初遇的温柔',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 38%',
        },
      ],
    },
    {
      group: 'Chapter II · 共鸣',
      groupZh: '共鸣',
      date: '2023-12-20',
      items: [
        {
          src: 'assets/photos/69b726317e5dbdc58b3fa05ded4743fa.jpg',
          alt: '许超与程昱相视牵手',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 64%',
        },
      ],
    },
    {
      group: 'Chapter III · 誓言',
      groupZh: '誓言',
      date: '2025-10-04',
      items: [
        {
          src: 'assets/photos/story-01.jpg',
          alt: '许超与程昱在花拱下',
          caption: 'Under the arch, we promised forever.',
          ratio: '4 / 5',
          objectPosition: '50% 72%',
          frame: 'arch',
        },
      ],
    },
    {
      group: 'Chapter IV · 誓约',
      groupZh: '誓约',
      date: '2025-12-18',
      items: [
        {
          src: 'assets/photos/story-02.jpg',
          alt: '许超与程昱在草地挥手',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 28%',
        },
      ],
    },
    {
      group: 'Chapter V · 合影',
      groupZh: '合影',
      date: '2026-11-16',
      items: [
        {
          src: 'assets/photos/2ec70a7c7d7f16f02c6e67c323d47a91.jpg',
          alt: '许超与程昱的婚纱大片',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 84%',
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

    // 远端存储：填好后亲友互相可见；留空则只存在各自手机本地。
    // 约定的接口形态（Supabase / CloudBase HTTP 函数 / 自建 API 均可满足）：
    //   GET  endpoint + listQuery  → [{ name, message, at }]
    //   POST endpoint              ← { name, message, at }
    // 字段名兼容 content / guestName / created_at 等常见写法。
    remote: {
      enabled: false,
      endpoint: '',
      listQuery: '?select=name,message,at&order=at.asc&limit=200',
      apiKey: '',
      headers: {},
      pollMs: 20000,
    },
  },

  share: {
    title: '许超 & 程昱 · 婚礼邀请函',
    description: '2026.11.16 · 陶然居',
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
