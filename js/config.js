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
          src: 'assets/photos/0B9A0951.jpg',
          alt: '许超与程昱步入白色教堂',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0952.jpg',
          alt: '许超与程昱在教堂花径相携',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0967.jpg',
          alt: '许超与程昱于教堂绿意回廊',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0973.jpg',
          alt: '许超与程昱在哥特拱窗前相望',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0983.jpg',
          alt: '程昱倚身于教堂石门',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0987.jpg',
          alt: '程昱拖着长纱走向教堂深处',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A1003.jpg',
          alt: '程昱的长纱铺展在教堂红毯',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0852.jpg',
          alt: '许超为程昱轻理头纱',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0853.jpg',
          alt: '程昱手捧花静坐',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
      ],
    },
    {
      group: 'Chapter II · 庄园',
      groupZh: '庄园',
      items: [
        {
          src: 'assets/photos/0B9A0877.jpg',
          alt: '许超与程昱远立庄园石门',
          caption: '',
          ratio: '3 / 2',
          objectFit: 'contain',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0880.jpg',
          alt: '许超与程昱在喷泉旁相依',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0890.jpg',
          alt: '许超与程昱于喷泉边起舞',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0901.jpg',
          alt: '许超与程昱穿过庄园石拱',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0919.jpg',
          alt: '许超与程昱立于藤蔓拱门下',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
      ],
    },
    {
      group: 'Chapter III · 草坪',
      groupZh: '草坪',
      items: [
        {
          src: 'assets/photos/0B9A0789.jpg',
          alt: '许超与程昱在花拱草坪合影',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0817.jpg',
          alt: '程昱的长纱拖曳在绿拱草坪',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A0842.jpg',
          alt: '许超与程昱走过花拱长廊',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A1150.jpg',
          alt: '许超与程昱手捧花草坪留影',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A1153.jpg',
          alt: '许超与程昱在草坪上相吻',
          caption: '',
          ratio: '3 / 2',
          objectFit: 'contain',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/0B9A1154.jpg',
          alt: '许超与程昱遥望于开阔草坪',
          caption: '',
          ratio: '3 / 2',
          objectFit: 'contain',
          objectPosition: '50% 46%',
        },
      ],
    },
    {
      group: 'Chapter IV · 窗边',
      groupZh: '窗边',
      items: [
        {
          src: 'assets/photos/DSC_3720.jpg',
          alt: '程昱坐在拱形窗前',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/DSC_3733.jpg',
          alt: '许超与程昱在拱窗边牵手',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/DSC_3744.jpg',
          alt: '程昱独立于明亮拱窗前',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/DSC_3762.jpg',
          alt: '许超与程昱在蓝窗前相依',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/DSC_3777.jpg',
          alt: '许超与程昱在烟雾蓝窗前',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
        {
          src: 'assets/photos/DSC_3804.jpg',
          alt: '程昱在钢琴旁的静影',
          caption: '',
          ratio: '3 / 4',
          objectPosition: '50% 46%',
        },
      ],
    },
  ],

  guestNotes: {
    enabled: true,
    moderation: false,
    supabase: {
      url: 'https://fkufazfjglksaacehhdq.supabase.co',
      publishableKey: 'sb_publishable_z2xlk_nUtRClpNNCh6bisA_PUe4huXT',
    },
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
    description: '2026年11月16日中午12:00 · 山东临沂陶然居大酒店',
    image: 'assets/share/wechat-thumb-v1.jpg',
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
