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

  /* 02 致谢字幕：每段为一组，段内每行一句；滚动到可见时逐行淡入 */
  thanks: {
    title: '致谢',
    kicker: 'With Gratitude',
    stanzas: [
      [
        '从相识的那天起',
        '我们走过许多寻常的日子',
        '也一起看过不寻常的风景',
        '才慢慢懂得',
        '好的感情，是两个人一起长大',
      ],
      [
        '谢谢两家的爸爸妈妈',
        '把我们养大，又放手让我们去爱',
        '无论走多远',
        '家永远是我们回头就能看见的灯',
      ],
      [
        '谢谢一路相伴的亲友',
        '在每一个重要的时刻',
        '都有你们在身旁',
        '那些笑声与祝福，我们一直记得',
      ],
      [
        '我们将许下一生的约定',
        '诚邀最挚爱的你们',
        '来见证这份平凡而珍贵的幸福',
      ],
    ],
    closing: [
      '谢谢你们',
      '成为我们故事里最温暖的一部分',
    ],
    signature: '许超 & 程昱',
  },

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
