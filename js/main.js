/**
 * 婚礼邀请函 — 入口脚本
 * 阶段 1：Cover · 序章·叩门
 * 阶段 2：Our Story · 暗调流光时间线
 * 阶段 3：Countdown · 倒计时与大日子闭环
 * 阶段 4：Gallery · 独立影像相片簿
 * 阶段 5：Wishes · 弹幕祝福互动
 * 阶段 6：Venue · 酒店导航与温馨落幕
 *
 * 1. 用 CONFIG 覆盖封面 [data-config] 文案，并渲染时间线
 * 2. 火漆印启缄：body.is-envelope-opened → 翻盖掀起后进入 02 Our Story
 * 3. 启缄手势内播放背景乐（浏览器禁止无手势自动播放）
 * 4. 相片叠放：轻扫切换正面合照，点击打开全屏预览
 * 5. 祝福写入 Supabase，全网实时同步到弹幕
 * 6. 落幕页写入地点、日期，并绑定高德 / 腾讯导航
 */
(function () {
  'use strict';

  var cover = document.getElementById('cover');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var OPEN_MS = prefersReducedMotion ? 0 : 1500;
  var bgm = document.getElementById('bgm');
  var audioToggle = document.querySelector('.audio-toggle');
  var audioReady = false;

  /** 许超 → 许 超 */
  function spacedName(name) {
    return String(name || '').split('').join(' ');
  }

  /** 2026-11-16 → 2026 . 11 . 16 */
  function formatDate(isoDate) {
    var parts = String(isoDate || '').split('-');
    return parts.length === 3 ? parts.join(' . ') : '';
  }

  /** 2023-12-08 → 2023.12.08 */
  function formatStoryDate(isoDate) {
    var parts = String(isoDate || '').split('-');
    return parts.length === 3 ? parts.join('.') : String(isoDate || '');
  }

  /** 2026-11-16 + 12:00:00 → 2026-11-16T12:00:00 */
  function weddingDateTime(wedding) {
    var date = wedding && wedding.date ? wedding.date : '';
    var clock = wedding && wedding.time ? String(wedding.time).slice(0, 8) : '';
    return clock ? date + 'T' + clock : date;
  }

  function storyNodeId(isoDate) {
    var parts = String(isoDate || '').split('-');
    return parts.length === 3 ? 'story-' + parts[1] + '-' + parts[2] : '';
  }

  function syncFromConfig() {
    if (typeof CONFIG === 'undefined' || !cover) return;

    var values = {
      groom: spacedName(CONFIG.couple.groom),
      bride: spacedName(CONFIG.couple.bride),
      date: formatDate(CONFIG.wedding.date),
      time: CONFIG.wedding.timeLabel || '',
      venue: CONFIG.wedding.venue,
    };

    Object.keys(values).forEach(function (key) {
      var el = cover.querySelector('[data-config="' + key + '"]');
      if (el && values[key]) el.textContent = values[key];
    });

    var time = cover.querySelector('time[data-config="date"]');
    if (time && CONFIG.wedding.date) {
      time.setAttribute('datetime', weddingDateTime(CONFIG.wedding));
    }

    bindVenue();
  }

  function bindVenue() {
    var venue = document.getElementById('venue');
    if (!venue || typeof CONFIG === 'undefined') return;

    var wedding = CONFIG.wedding || {};
    var closing = CONFIG.closing || {};
    var dateEl = venue.querySelector('[data-config="venue-date"]');
    var hourEl = venue.querySelector('[data-config="venue-time"]');
    var nameEl = venue.querySelector('[data-config="venue-name"]');
    var addressEl = venue.querySelector('[data-config="venue-address"]');
    var gateEl = venue.querySelector('[data-config="venue-gate"]');
    var monoEl = venue.querySelector('[data-config="closing-mono"]');
    var wishEl = venue.querySelector('[data-config="closing-wish"]');

    if (dateEl && wedding.date) {
      dateEl.textContent = formatStoryDate(wedding.date);
      dateEl.setAttribute('datetime', weddingDateTime(wedding));
    }
    if (hourEl && wedding.timeLabel) hourEl.textContent = wedding.timeLabel;
    if (nameEl && wedding.venue) nameEl.textContent = wedding.venue;
    if (addressEl && wedding.address) addressEl.textContent = wedding.address;
    if (gateEl && wedding.entrance) gateEl.textContent = '请从' + wedding.entrance + '进入';
    if (monoEl && closing.monogram) monoEl.textContent = closing.monogram;
    if (wishEl && closing.message) wishEl.textContent = closing.message;

    bindVenueNav(venue, wedding);
  }

  var MAP_SRC = 'xuchao-chengyu-wedding';

  function mapPlaceName(wedding) {
    return wedding.mapName || wedding.hotel || wedding.venue || '';
  }

  function mapAddress(wedding) {
    var address = wedding.address || '';
    if (wedding.entrance && address && address.indexOf(wedding.entrance) === -1) {
      return address + '（' + wedding.entrance + '）';
    }
    return address;
  }

  function venueCopyText(wedding) {
    var parts = [
      wedding.date ? formatStoryDate(wedding.date) : '',
      wedding.timeLabel || '',
      wedding.hotel || wedding.venue || '',
      wedding.address || ''
    ];
    if (wedding.entrance) parts.push('请从' + wedding.entrance + '进入');
    return parts.filter(Boolean).join(' · ');
  }

  function venueHint(wedding) {
    var hotel = wedding.hotel || wedding.venue || '酒店';
    var gate = wedding.entrance ? '，请从' + wedding.entrance + '进入' : '';
    if (/micromessenger/i.test(navigator.userAgent)) {
      return '微信内请优先使用腾讯地图' + gate;
    }
    return '导航至' + hotel + gate;
  }

  function mapKeyword(wedding) {
    var name = mapPlaceName(wedding);
    if (wedding.address && name.indexOf(wedding.address) === -1) {
      return name + ' ' + wedding.address;
    }
    return name;
  }

  /** 高德：有坐标则驾车导航到门口；否则用全称 + 城市搜索，避免全国同名店 */
  function amapUrl(wedding) {
    if (wedding.mapUrl) return wedding.mapUrl;

    var tail = '&src=' + MAP_SRC + '&callnative=1';
    var name = mapPlaceName(wedding);

    if (wedding.coords) {
      return 'https://uri.amap.com/navigation?to=' +
        encodeURIComponent(wedding.coords + ',' + name) +
        '&mode=car&coordinate=gaode' + tail;
    }
    if (wedding.poiId) {
      return 'https://uri.amap.com/marker?poiid=' + encodeURIComponent(wedding.poiId) + tail;
    }
    return 'https://uri.amap.com/search?keyword=' + encodeURIComponent(mapKeyword(wedding)) +
      '&city=' + encodeURIComponent(wedding.city || '') + tail;
  }

  /** 腾讯：coord 为 '纬度,经度'，与高德 '经度,纬度' 相反；微信内优先走这条 */
  function qqMapUrl(wedding) {
    var name = mapPlaceName(wedding);
    var referer = '&referer=' + MAP_SRC;

    if (wedding.coords) {
      var pair = wedding.coords.split(',');
      var marker = 'coord:' + pair[1] + ',' + pair[0] +
        ';title:' + name +
        ';addr:' + mapAddress(wedding);
      return 'https://apis.map.qq.com/uri/v1/marker?marker=' + encodeURIComponent(marker) + referer;
    }
    return 'https://apis.map.qq.com/uri/v1/search?keyword=' + encodeURIComponent(mapKeyword(wedding)) +
      '&region=' + encodeURIComponent(wedding.city || '') + referer;
  }

  /* iOS 微信需要真实 textarea 才能选中，readonly 可避免软键盘弹出 */
  function legacyCopy(text) {
    var pad = document.createElement('textarea');
    pad.value = text;
    pad.setAttribute('readonly', 'readonly');
    pad.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
    document.body.appendChild(pad);
    pad.select();
    pad.setSelectionRange(0, text.length);

    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(pad);
    return ok;
  }

  function copyAddress(text) {
    function fallback() {
      return legacyCopy(text) ? Promise.resolve() : Promise.reject(new Error('copy-unavailable'));
    }

    /* 异步剪贴板在失焦或非安全上下文下会被拒绝，需再降级一层 */
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(fallback);
    }
    return fallback();
  }

  function bindVenueNav(venue, wedding) {
    var amap = venue.querySelector('[data-nav="amap"]');
    var qq = venue.querySelector('[data-nav="qq"]');
    var copy = venue.querySelector('[data-nav="copy"]');
    var hint = venue.querySelector('.venue__nav-hint');

    if (amap) amap.setAttribute('href', amapUrl(wedding));
    if (qq) qq.setAttribute('href', qqMapUrl(wedding));

    if (hint) hint.textContent = venueHint(wedding);

    if (!copy) return;
    copy.addEventListener('click', function (event) {
      event.preventDefault();
      var text = venueCopyText(wedding);
      copyAddress(text).then(function () {
        if (hint) hint.textContent = '地址已复制，可粘贴到任意地图 App';
      }).catch(function () {
        if (hint) hint.textContent = '请长按复制：' + text;
      });
    });
  }

  function renderStory() {
    var list = document.getElementById('timeline');
    if (!list || typeof CONFIG === 'undefined' || !CONFIG.timeline) return;

    list.textContent = '';

    CONFIG.timeline.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'timeline__node';
      var nodeId = storyNodeId(item.date);
      if (nodeId) li.id = nodeId;
      if (item.highlight) li.classList.add('timeline__node--wedding');
      if (item.stack || item.frame === 'landscape' || !item.photo) {
        li.classList.add('timeline__node--stack');
      }
      if (item.photo) li.classList.add('timeline__node--has-photo');

      var copy = document.createElement('div');
      copy.className = 'timeline__copy';

      var time = document.createElement('time');
      time.className = 'timeline__date';
      if (item.date) time.setAttribute('datetime', item.date);
      time.textContent = formatStoryDate(item.date);

      var en = document.createElement('h3');
      en.className = 'timeline__en';
      en.textContent = item.title || '';

      var zh = document.createElement('p');
      zh.className = 'timeline__zh';
      zh.textContent = item.caption || '';

      copy.appendChild(time);
      copy.appendChild(en);
      copy.appendChild(zh);
      li.appendChild(copy);

      if (item.photo) {
        var figure = document.createElement('figure');
        figure.className = 'timeline__frame';
        if (item.frame) figure.classList.add('timeline__frame--' + item.frame);

        var img = document.createElement('img');
        img.src = item.photo;
        img.alt = item.photoAlt || '';
        img.loading = 'lazy';
        img.decoding = 'async';

        figure.appendChild(img);
        li.appendChild(figure);
      }

      list.appendChild(li);
    });
  }

  function padDigits(value, width) {
    var text = String(Math.max(0, value | 0));
    while (text.length < width) text = '0' + text;
    return text;
  }

  function weddingTargetDate() {
    if (typeof CONFIG === 'undefined' || !CONFIG.wedding || !CONFIG.wedding.date) {
      return null;
    }
    var time = CONFIG.wedding.time ? CONFIG.wedding.time : '00:00:00';
    var parsed = new Date(CONFIG.wedding.date + 'T' + time);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  function remainingUntil(target) {
    var ms = target.getTime() - Date.now();
    if (ms < 0) ms = 0;
    var total = Math.floor(ms / 1000);
    var days = Math.floor(total / 86400);
    total %= 86400;
    var hours = Math.floor(total / 3600);
    total %= 3600;
    return {
      days: days,
      hours: hours,
      minutes: Math.floor(total / 60),
      seconds: total % 60
    };
  }

  function setTextIfChanged(el, value) {
    if (el && el.textContent !== value) el.textContent = value;
  }

  function initCountdown() {
    var root = document.getElementById('countdown');
    if (!root) return;

    var target = weddingTargetDate();
    var dateEl = root.querySelector('[data-config="countdown-date"]');
    var status = document.getElementById('countdown-status');
    var daysEl = root.querySelector('[data-unit="days"]');
    var hoursEl = root.querySelector('[data-unit="hours"]');
    var minutesEl = root.querySelector('[data-unit="minutes"]');
    var secondsEl = root.querySelector('[data-unit="seconds"]');

    if (dateEl && typeof CONFIG !== 'undefined' && CONFIG.wedding && CONFIG.wedding.date) {
      dateEl.textContent = formatStoryDate(CONFIG.wedding.date);
      dateEl.setAttribute('datetime', weddingDateTime(CONFIG.wedding));
    }

    if (!target || !daysEl) return;

    var lastSpokenDays = -1;

    function tick() {
      var parts = remainingUntil(target);
      setTextIfChanged(daysEl, padDigits(parts.days, 3));
      setTextIfChanged(hoursEl, padDigits(parts.hours, 2));
      setTextIfChanged(minutesEl, padDigits(parts.minutes, 2));
      setTextIfChanged(secondsEl, padDigits(parts.seconds, 2));

      if (status && parts.days !== lastSpokenDays) {
        lastSpokenDays = parts.days;
      status.textContent = parts.days === 0 && parts.hours === 0 && parts.minutes === 0 && parts.seconds === 0
          ? '婚礼之日已至。'
          : '距离婚礼还有 ' + parts.days + ' 天。';
      }
    }

    tick();
    window.setInterval(tick, 1000);
  }

  function collectGalleryPhotos() {
    if (typeof CONFIG === 'undefined' || !Array.isArray(CONFIG.photos)) return [];

    var photos = [];
    CONFIG.photos.forEach(function (group) {
      (group.items || []).forEach(function (item) {
        if (!item || !item.src) return;
        photos.push({
          src: item.src,
          alt: item.alt || '',
          caption: item.caption || '',
          objectPosition: item.objectPosition || '',
          objectFit: item.objectFit || ''
        });
      });
    });
    return photos;
  }

  function padIndex(value) {
    var text = String(value);
    return text.length < 2 ? '0' + text : text;
  }

  function initGallery() {
    var stack = document.getElementById('gallery-stack');
    var indexEl = document.getElementById('gallery-index');
    var overlay = document.getElementById('lightbox');
    var photos = collectGalleryPhotos();
    if (!stack || !photos.length) return;

    var image = overlay ? overlay.querySelector('.lightbox__image') : null;
    var caption = overlay ? overlay.querySelector('.lightbox__caption') : null;
    var closeBtn = overlay ? overlay.querySelector('.lightbox__close') : null;
    var current = 0;
    var cards = [];
    var lastFocus = null;
    var closeTimer = 0;
    var drag = null;

    function render() {
      stack.textContent = '';
      cards = photos.map(function (photo, index) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'gallery-card';
        card.setAttribute('data-index', String(index));
        card.setAttribute('aria-label', '查看大图：' + (photo.alt || '婚纱合照'));

        var img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt || '';
        img.draggable = false;
        img.decoding = 'async';
        if (index > 1) img.loading = 'lazy';

        card.appendChild(img);
        stack.appendChild(card);
        return card;
      });
    }

    function layerCards() {
      cards.forEach(function (card, index) {
        var dist = index - current;
        card.classList.remove('is-front', 'is-next', 'is-after', 'is-prev', 'is-idle');
        card.style.transform = '';
        card.style.opacity = '';

        if (dist === 0) card.classList.add('is-front');
        else if (dist === 1) card.classList.add('is-next');
        else if (dist === 2) card.classList.add('is-after');
        else if (dist === -1) card.classList.add('is-prev');
        else card.classList.add('is-idle');

        card.tabIndex = dist === 0 ? 0 : -1;
      });

      if (indexEl) {
        indexEl.textContent = padIndex(current + 1) + ' / ' + padIndex(photos.length);
      }
    }

    function goTo(next) {
      if (next < 0 || next >= photos.length || next === current) {
        layerCards();
        return false;
      }
      current = next;
      layerCards();
      return true;
    }

    function openLightbox() {
      if (!overlay || !image) return;
      var photo = photos[current];
      if (!photo) return;

      window.clearTimeout(closeTimer);
      lastFocus = document.activeElement;
      image.src = photo.src;
      image.alt = photo.alt || '';

      if (caption) {
        caption.textContent = photo.caption || '';
        caption.hidden = !photo.caption;
      }

      overlay.inert = false;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-lightbox-open');
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      if (!overlay || !overlay.classList.contains('is-open')) return;

      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.inert = true;
      document.body.classList.remove('is-lightbox-open');

      closeTimer = window.setTimeout(function () {
        if (overlay.classList.contains('is-open') || !image) return;
        image.removeAttribute('src');
        image.alt = '';
      }, prefersReducedMotion ? 0 : 480);

      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }

    function showLightboxPhoto() {
      var photo = photos[current];
      if (!photo || !image) return;
      image.src = photo.src;
      image.alt = photo.alt || '';
      if (caption) {
        caption.textContent = photo.caption || '';
        caption.hidden = !photo.caption;
      }
      layerCards();
    }

    function resist(dx) {
      if ((current === 0 && dx > 0) || (current === photos.length - 1 && dx < 0)) {
        return dx * 0.28;
      }
      return dx;
    }

    function clearLightboxShift() {
      if (overlay) overlay.classList.remove('is-dragging');
      if (image) image.style.transform = '';
    }

    function endDrag(target, onTap, onSwipe) {
      if (!drag) return;

      var dx = resist(drag.x);
      var dy = drag.y;
      var swiped = Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy);
      drag = null;

      if (target) target.classList.remove('is-dragging');
      clearLightboxShift();

      if (swiped) {
        onSwipe(dx < 0 ? 1 : -1);
        return;
      }

      layerCards();

      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        onTap();
      }
    }

    stack.addEventListener('pointerdown', function (event) {
      if (event.button && event.button !== 0) return;
      drag = { x: 0, y: 0, startX: event.clientX, startY: event.clientY, pointerId: event.pointerId };
      stack.classList.add('is-dragging');
      if (stack.setPointerCapture) stack.setPointerCapture(event.pointerId);
    });

    stack.addEventListener('pointermove', function (event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag.x = event.clientX - drag.startX;
      drag.y = event.clientY - drag.startY;

      var front = cards[current];
      if (!front) return;
      front.style.transform = 'translate3d(' + resist(drag.x) + 'px, 0, 0)';
    });

    stack.addEventListener('pointerup', function (event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      endDrag(stack, openLightbox, function (step) {
        if (!goTo(current + step)) layerCards();
      });
    });

    stack.addEventListener('pointercancel', function () {
      drag = null;
      stack.classList.remove('is-dragging');
      layerCards();
    });

    stack.addEventListener('click', function (event) {
      event.preventDefault();
    });

    if (overlay) {
      overlay.addEventListener('pointerdown', function (event) {
        if (event.button && event.button !== 0) return;
        drag = { x: 0, y: 0, startX: event.clientX, startY: event.clientY, pointerId: event.pointerId };
      });

      overlay.addEventListener('pointermove', function (event) {
        if (!drag || event.pointerId !== drag.pointerId || !image) return;
        drag.x = event.clientX - drag.startX;
        drag.y = event.clientY - drag.startY;
        if (Math.abs(drag.x) < Math.abs(drag.y)) return;
        overlay.classList.add('is-dragging');
        image.style.transform = 'translate3d(' + resist(drag.x) + 'px, 0, 0)';
      });

      overlay.addEventListener('pointerup', function (event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        var tappedClose = event.target.closest && event.target.closest('.lightbox__close');
        var tappedBlank = event.target === overlay || event.target.classList.contains('lightbox__stage');

        endDrag(null, function () {
          if (tappedClose || tappedBlank) closeLightbox();
        }, function (step) {
          goTo(current + step);
          showLightboxPhoto();
        });
      });
    }

    document.addEventListener('keydown', function (event) {
      if (overlay && overlay.classList.contains('is-open')) {
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowRight') {
          goTo(current + 1);
          showLightboxPhoto();
        }
        if (event.key === 'ArrowLeft') {
          goTo(current - 1);
          showLightboxPhoto();
        }
        return;
      }

      if (!stack.contains(document.activeElement)) return;
      if (event.key === 'ArrowRight') goTo(current + 1);
      if (event.key === 'ArrowLeft') goTo(current - 1);
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });

    render();
    layerCards();
  }

  function transitionToChapterTwo() {
    if (cover) cover.classList.add('is-open');
    var story = document.getElementById('story');
    if (story) story.classList.add('is-revealed');
  }

  function syncAudioToggle() {
    if (!audioToggle || !bgm) return;
    var muted = bgm.paused || bgm.muted;
    audioToggle.hidden = !audioReady;
    audioToggle.setAttribute('aria-pressed', muted ? 'true' : 'false');
    audioToggle.setAttribute('aria-label', muted ? '打开背景音乐' : '关闭背景音乐');
    audioToggle.classList.toggle('is-muted', muted);
  }

  function playBgm() {
    if (!bgm || !bgm.getAttribute('src')) return Promise.resolve();
    bgm.muted = false;
    var playPromise = bgm.play();
    if (!playPromise || typeof playPromise.then !== 'function') {
      audioReady = true;
      syncAudioToggle();
      return Promise.resolve();
    }
    return playPromise.then(function () {
      audioReady = true;
      syncAudioToggle();
    }).catch(function () {
      audioReady = true;
      syncAudioToggle();
    });
  }

  function initAudio() {
    if (!bgm || typeof CONFIG === 'undefined' || !CONFIG.audio || !CONFIG.audio.src) {
      return;
    }

    bgm.src = encodeURI(CONFIG.audio.src);
    bgm.loop = CONFIG.audio.loop !== false;
    bgm.volume = typeof CONFIG.audio.volume === 'number' ? CONFIG.audio.volume : 0.42;
    bgm.load();

    if (audioToggle) {
      audioToggle.addEventListener('click', function () {
        if (bgm.paused) {
          playBgm();
          return;
        }
        bgm.pause();
        syncAudioToggle();
      });
    }
  }

  function bindSeal() {
    if (!cover) return;
    var seal = cover.querySelector('.wax-seal');
    if (!seal) return;

    seal.addEventListener('click', function () {
      playBgm();

      if (document.body.classList.contains('is-envelope-opened')) {
        return;
      }

      document.body.classList.add('is-envelope-opened');
      window.setTimeout(transitionToChapterTwo, OPEN_MS);
    });
  }

  var WISH_TRACKS = 4;
  var WISH_SPEED = 42;
  var WISH_GAP = 56;
  function createBlessingsClient() {
    var settings = typeof CONFIG !== 'undefined' && CONFIG.guestNotes && CONFIG.guestNotes.supabase;
    if (!settings || !window.supabase || typeof window.supabase.createClient !== 'function') {
      return null;
    }
    return window.supabase.createClient(settings.url, settings.publishableKey);
  }

  function composeWishText(name, message) {
    var who = String(name || '').trim();
    var text = String(message || '').trim();
    return who ? text + ' - ' + who : text;
  }

  function normalizeWish(raw) {
    if (!raw) return null;

    var message = String(raw.message || '').trim();
    if (!message) return null;

    return {
      id: raw.id != null ? String(raw.id) : '',
      name: String(raw.name || '').trim(),
      message: message,
    };
  }

  function createWishItem(wish) {
    var item = document.createElement('p');
    item.className = 'danmu-item';
    if (wish.id) item.setAttribute('data-wish-id', wish.id);
    if (wish.fresh) item.classList.add('danmu-item--fresh');
    item.textContent = wish.text;
    return item;
  }

  function setWishHint(hint, text) {
    if (!hint) return;
    if (!text) {
      hint.hidden = true;
      hint.textContent = '';
      return;
    }
    hint.hidden = false;
    hint.textContent = text;
  }

  function initWishes() {
    var container = document.getElementById('danmu-container');
    var form = document.getElementById('wish-form');
    if (!container || !form) return;

    var nameInput = form.querySelector('[name="guestName"]');
    var messageInput = form.querySelector('[name="message"]');
    var hint = document.getElementById('wish-hint');
    var emptyNote = document.getElementById('danmu-empty');
    var emptyText = typeof CONFIG !== 'undefined' && CONFIG.guestNotes && CONFIG.guestNotes.emptyText;
    var db = createBlessingsClient();

    var queue = [];
    var seen = {};
    var onWishReady = null;

    function syncEmptyNote() {
      if (!emptyNote) return;
      emptyNote.hidden = queue.length > 0;
      if (queue.length) return;
      emptyNote.textContent = emptyText || '还没有人留下祝福，等你写下第一句';
    }

    function wishKey(wish) {
      if (wish.id) return 'id:' + wish.id;
      return wish.name + '\u0001' + wish.message;
    }

    function addWish(raw, fresh) {
      var wish = normalizeWish(raw);
      if (!wish || seen[wishKey(wish)]) return null;
      seen[wishKey(wish)] = true;

      var entry = {
        id: wish.id,
        name: wish.name,
        message: wish.message,
        text: composeWishText(wish.name, wish.message),
        fresh: !!fresh,
      };
      queue.push(entry);
      syncEmptyNote();
      if (onWishReady) onWishReady(entry);
      return entry;
    }

    function loadBlessings() {
      if (!db) {
        setWishHint(hint, '祝福簿未能接通。');
        return;
      }

      if (emptyNote) {
        emptyNote.hidden = false;
        emptyNote.textContent = '正在取回来宾的祝福…';
      }

      db.from('blessings')
        .select('id, name, message')
        .then(function (result) {
          if (result.error) throw result.error;
          (result.data || []).forEach(function (row) {
            addWish(row, false);
          });
          syncEmptyNote();
        })
        .catch(function () {
          if (emptyNote && !queue.length) {
            emptyNote.hidden = false;
            emptyNote.textContent = emptyText || '还没有人留下祝福，等你写下第一句';
          }
          setWishHint(hint, '祝福簿暂时无法读取。');
        });
    }

    function listenBlessings() {
      if (!db || typeof db.channel !== 'function') return;

      db.channel('blessings-live')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'blessings',
        }, function (payload) {
          addWish(payload && payload.new, true);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'blessings',
        }, function (payload) {
          removeWish(payload && payload.old);
        })
        .subscribe();
    }

    function removeWish(raw) {
      if (!raw || raw.id == null) return;
      var id = String(raw.id);
      queue = queue.filter(function (wish) { return wish.id !== id; });
      delete seen['id:' + id];
      Array.prototype.forEach.call(container.querySelectorAll('[data-wish-id]'), function (item) {
        if (item.getAttribute('data-wish-id') === id) item.remove();
      });
      syncEmptyNote();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = nameInput ? nameInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      if (nameInput) nameInput.classList.toggle('is-invalid', !name);
      if (messageInput) messageInput.classList.toggle('is-invalid', !message);

      if (!name || !message) {
        setWishHint(hint, '请写下姓名与祝福后再送出。');
        return;
      }

      if (!db) {
        setWishHint(hint, '祝福簿未能接通。');
        return;
      }

      setWishHint(hint, '正在送出祝福…');

      db.from('blessings')
        .insert({ name: name, message: message })
        .select('id, name, message')
        .then(function (result) {
          if (result.error) throw result.error;
          var row = result.data && result.data[0];
          addWish(row || { name: name, message: message }, true);
          form.reset();
          if (nameInput) nameInput.classList.remove('is-invalid');
          if (messageInput) messageInput.classList.remove('is-invalid');
          setWishHint(hint, '发送成功。');
        })
        .catch(function () {
          setWishHint(hint, '发送失败，请稍后再试。');
        });
    });

    if (prefersReducedMotion) {
      queue.forEach(function (wish) {
        container.appendChild(createWishItem(wish));
      });
      onWishReady = function (wish) {
        container.insertBefore(createWishItem(wish), container.firstChild);
      };
      syncEmptyNote();
      loadBlessings();
      listenBlessings();
      return;
    }

    container.classList.add('is-live');
    syncEmptyNote();

    var cursor = 0;
    var pending = [];
    var tracks = [];

    function nextWish() {
      if (pending.length) return pending.shift();

      for (var i = 0; i < queue.length; i += 1) {
        var wish = queue[(cursor + i) % queue.length];
        if (!wish.live) {
          cursor = (cursor + i + 1) % queue.length;
          return wish;
        }
      }
      return null;
    }

    function trackBusyMs(track) {
      var last = track.last;
      if (!last || !last.parentNode) return 0;
      var overhang = last.getBoundingClientRect().right -
        container.getBoundingClientRect().right + WISH_GAP;
      return overhang > 0 ? (overhang / WISH_SPEED) * 1000 : 0;
    }

    function launch(track, wish, progress) {
      var item = createWishItem(wish);
      item.setAttribute('data-track', String(track.index));
      container.appendChild(item);

      var width = item.offsetWidth;
      var travel = container.offsetWidth + width + WISH_GAP;
      var duration = travel / WISH_SPEED;

      item.style.setProperty('--danmu-travel', travel + 'px');
      item.style.animationDuration = duration.toFixed(2) + 's';
      item.style.webkitAnimationDuration = duration.toFixed(2) + 's';
      if (progress) {
        var delay = (-duration * progress).toFixed(2) + 's';
        item.style.animationDelay = delay;
        item.style.webkitAnimationDelay = delay;
      }
      wish.live = true;
      wish.fresh = false;
      item.addEventListener('animationend', function () {
        wish.live = false;
        if (item.parentNode) item.parentNode.removeChild(item);
      });

      track.last = item;

      var remainingPx = Math.max(0, width + WISH_GAP - travel * (progress || 0));
      return Math.max(400, (remainingPx / WISH_SPEED) * 1000);
    }

    function scheduleTrack(track, wait) {
      window.clearTimeout(track.timer);
      track.freeAt = Date.now() + wait;
      track.timer = window.setTimeout(function () { runTrack(track); }, wait);
    }

    function runTrack(track) {
      var busy = trackBusyMs(track);
      if (busy > 0) {
        scheduleTrack(track, busy);
        return;
      }

      var wish = nextWish();
      scheduleTrack(track, wish ? launch(track, wish, 0) : 1500);
    }

    for (var i = 0; i < WISH_TRACKS; i += 1) {
      tracks.push({ index: i + 1, timer: 0, freeAt: 0, last: null });
    }

    tracks.forEach(function (track, index) {
      scheduleTrack(track, 800 + index * 280);
    });

    onWishReady = function (wish) {
      if (wish.fresh) {
        pending.push(wish);
      }

      var target = tracks[0];
      tracks.forEach(function (track) {
        if (track.freeAt < target.freeAt) target = track;
      });
      scheduleTrack(target, Math.max(0, target.freeAt - Date.now()));
    };

    loadBlessings();
    listenBlessings();
  }

  syncFromConfig();
  renderStory();
  initCountdown();
  initGallery();
  initAudio();
  bindSeal();
  initWishes();
})();
