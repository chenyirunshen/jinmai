/* 宿迁金麦工艺制品有限公司 · 交互脚本 */
(function () {
  'use strict';

  /* 移动端导航切换 */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    // 点击链接后自动收起菜单
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  /* 返回顶部按钮 */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 语言：浏览器自动识别 + 顶部国旗语言条 + 选择记忆 */
  (function () {
    var path = window.location.pathname;
    var inEn = /\/en\/|en\/index\.html|\/en$/.test(path);
    var file = path.split('/').pop();
    if (!file) file = 'index.html';

    function flagCN() {
      return '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#DE2910"/><g fill="#FFDE00"><circle cx="6" cy="6" r="3"/><circle cx="11.5" cy="3.8" r="1"/><circle cx="13.3" cy="6" r="1"/><circle cx="11.5" cy="8.2" r="1"/><circle cx="8.2" cy="9" r="1"/></g></svg>';
    }
    function flagEN() {
      return '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" stroke-width="2"/><rect x="13" width="4" height="20" fill="#fff"/><rect y="8" width="30" height="4" fill="#fff"/><rect x="13" width="4" height="20" fill="#C8102E"/><rect y="8" width="30" height="4" fill="#C8102E"/></svg>';
    }

    // 1) 自动识别浏览器语言（仅当用户未手动选择时，避免循环跳转）
    var choice = null;
    try { choice = localStorage.getItem('jm_lang'); } catch (e) {}
    if (!choice) {
      var navLang = (navigator.language || navigator.userLanguage || 'zh').toLowerCase();
      var wantEn = navLang.indexOf('en') === 0;
      if (wantEn && !inEn) { window.location.replace('en/' + file); return; }
      if (!wantEn && inEn) { window.location.replace('../' + file); return; }
    }

    // 2) 注入顶部国旗语言条
    function remember(which) { try { localStorage.setItem('jm_lang', which); } catch (e) {} }
    var bar = document.createElement('div');
    bar.className = 'topbar';
    var inner = document.createElement('div');
    inner.className = 'container topbar-inner';

    var left = document.createElement('span');
    left.className = 'lead-left';
    left.textContent = 'Suqian Jinmai · Worldwide Shipping';
    inner.appendChild(left);

    var switchWrap = document.createElement('div');
    switchWrap.className = 'lang-switch-top';

    var cn = document.createElement('a');
    cn.href = inEn ? '../' + file : '#';
    cn.className = 'lang-opt' + (inEn ? '' : ' active');
    cn.innerHTML = flagCN() + '<span>中文</span>';
    cn.addEventListener('click', function () { remember('zh'); });

    var en = document.createElement('a');
    en.href = inEn ? '#' : 'en/' + file;
    en.className = 'lang-opt' + (inEn ? ' active' : '');
    en.innerHTML = flagEN() + '<span>English</span>';
    en.addEventListener('click', function () { remember('en'); });

    switchWrap.appendChild(cn);
    switchWrap.appendChild(en);
    inner.appendChild(switchWrap);
    bar.appendChild(inner);
    document.body.insertBefore(bar, document.body.firstChild);
  })();

  /* 产品灯箱预览 */
  (function () {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('.gallery figure img, .series-photo img, .product-card .card-img img'));
    if (!imgs.length) return;

    // 构建灯箱 DOM
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<button class="lightbox-close" aria-label="关闭"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '<button class="lightbox-nav lightbox-prev" aria-label="上一张"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button class="lightbox-nav lightbox-next" aria-label="下一张"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '<img class="lightbox-img" alt="" /><div class="lightbox-cap"></div>';
    document.body.appendChild(box);

    var imgEl = box.querySelector('.lightbox-img');
    var capEl = box.querySelector('.lightbox-cap');
    var closeBtn = box.querySelector('.lightbox-close');
    var prevBtn = box.querySelector('.lightbox-prev');
    var nextBtn = box.querySelector('.lightbox-nav.lightbox-next');
    var idx = 0;

    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      var el = imgs[idx];
      imgEl.src = el.dataset.fullsrc || el.src;
      imgEl.alt = el.alt || '';
      var cap = el.dataset.caption || el.alt || '';
      var cat = el.dataset.cat || '';
      capEl.innerHTML = (cat ? '<span class="cat">' + cat + '</span>' : '') + cap;
    }
    function open(i) { show(i); box.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function close() { box.classList.remove('open'); document.body.style.overflow = ''; }

    imgs.forEach(function (el, i) {
      // 把 src 存入 data-fullsrc 以备灯箱使用；如需更高清，可单独指定
      if (!el.dataset.fullsrc) el.dataset.fullsrc = el.src;
      el.addEventListener('click', function () { open(i); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(idx - 1); });
    nextBtn.addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  /* 产品图册分类筛选 */
  (function () {
    var btns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.product-card[data-category]'));
    if (!btns.length || !cards.length) return;

    function apply(filter) {
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('is-hidden', !match);
      });
    }

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        apply(btn.getAttribute('data-filter'));
      });
    });
  })();
})();
