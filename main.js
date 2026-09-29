/* ============================================================
   My Corner · 全站脚本
   功能：汉堡菜单 / 首页关键词逐个淡入 / 滚动淡入 / 首页装饰轻微视差
   所有动效均支持 prefers-reduced-motion 降级
   ============================================================ */
(function () {
  'use strict';

  /* 用户是否开启了“减少动态效果” */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 汉堡菜单（移动端） ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
    document.body.classList.remove('menu-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      document.body.classList.toggle('menu-open', open);
    });

    /* 点击菜单里的链接后收起 */
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', closeMenu);
    }

    /* 按 Esc 键关闭菜单 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        toggle.focus(); /* 焦点还给按钮，方便键盘用户 */
      }
    });
  }

  /* ---------- 2. 首页关键词逐个淡入 ---------- */
  var keywords = document.querySelectorAll('.keywords li');
  if (keywords.length && !reduceMotion) {
    document.body.classList.add('anim-ready'); /* 加上后 CSS 才会先隐藏关键词 */
    for (var k = 0; k < keywords.length; k++) {
      (function (el, index) {
        setTimeout(function () { el.classList.add('show'); }, 200 + index * 150);
      })(keywords[k], k);
    }
  }

  /* ---------- 3. 滚动淡入（内页模块进入视口时出现） ---------- */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      /* 降级：直接全部显示 */
      for (var f = 0; f < fadeEls.length; f++) fadeEls[f].classList.add('visible');
    } else {
      document.body.classList.add('anim-ready');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target); /* 只出现一次 */
          }
        });
      }, { threshold: 0.12 });
      for (var j = 0; j < fadeEls.length; j++) io.observe(fadeEls[j]);
    }
  }

  /* ---------- 4. 首页装饰轻微视差（仅鼠标设备，位移 ≤8px） ---------- */
  var parallaxEls = document.querySelectorAll('.parallax');
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (parallaxEls.length && !reduceMotion && finePointer) {
    var targetX = 0, targetY = 0, curX = 0, curY = 0, rafId = null;

    function tick() {
      /* 线性插值让移动更柔和 */
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      for (var p = 0; p < parallaxEls.length; p++) {
        var depth = (p + 1) * 4; /* 每处装饰最大位移 4~8px */
        parallaxEls[p].style.transform =
          'translate(' + (curX * depth).toFixed(2) + 'px,' + (curY * depth).toFixed(2) + 'px)';
      }
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    document.addEventListener('mousemove', function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;  /* 归一化到 -1 ~ 1 */
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });
  }

  /* ---------- 5. 联系表单（静态站占位：组装 mailto 发邮件） ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements['name'].value.trim();
      var email = form.elements['email'].value.trim();
      var msg = form.elements['message'].value.trim();

      if (!msg) {
        var tip0 = document.getElementById('form-tip');
        if (tip0) tip0.textContent = '先写点想说的话再发送哦。';
        return;
      }

      var subject = encodeURIComponent('来自 My Corner 的留言 · ' + (name || '一位朋友'));
      var body = encodeURIComponent(msg + '\n\n—— ' + (name || '匿名朋友') + (email ? '（' + email + '）' : ''));
      window.location.href = 'mailto:hello@example.com?subject=' + subject + '&body=' + body;

      var tip = document.getElementById('form-tip');
      if (tip) tip.textContent = '已尝试打开你的邮件客户端；如果没有反应，请直接发邮件到 hello@example.com';
    });
  }

  /* ---------- 6. 挂绳照片板：两排各自独立的“拉绳”式转动装置 ---------- */
  var reelBtns = document.querySelectorAll('.reel-btn');
  for (var r = 0; r < reelBtns.length; r++) {
    (function (btn) {
      var row = btn.closest('.rope-row');
      var track = row ? row.querySelector('.rope-track') : null;
      var figs = track ? track.querySelectorAll('.hanging-photo') : [];
      if (!track || !figs.length) return;

      var count = figs.length; /* 这一排原本的照片数量 */
      var idx = 0;             /* 当前滑到的位置（0 起） */
      var step = 0;            /* 相邻两张照片的间距（px），即每次拉动的距离 */
      var timer = null;
      var angle = 0;
      var arrow = btn.querySelector('svg');

      /* 把整排照片复制一份接到绳子末尾，滑到尽头时就能无缝接回开头 */
      for (var c = 0; c < count; c++) {
        var clone = figs[c].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); /* 副本不进入读屏 */
        var sw = clone.querySelector('.swing');
        if (sw && c > 0) sw.style.animationDelay = (c * 0.4) + 's'; /* 与 CSS 错峰摆动一致 */
        track.appendChild(clone);
      }

      /* 测量一次拉动的距离：相邻两张照片的布局间距 */
      function measure() {
        step = figs.length > 1 ? (figs[1].offsetLeft - figs[0].offsetLeft) : 0;
      }

      function apply() {
        track.style.transform = 'translateX(' + (-idx * step) + 'px)';
      }

      /* 无感归零：滑完一轮后瞬间回到起点，画面完全相同，看不出来 */
      function snapBack() {
        track.style.transition = 'none';
        idx = 0;
        apply();
        void track.offsetWidth; /* 强制重排后再恢复过渡 */
        track.style.transition = '';
      }

      /* 拉动一格：整排照片沿绳子平滑滑到下一个位置 */
      function advance() {
        if (idx >= count) snapBack(); /* 保险：异常状态下先归位再拉 */
        idx++;
        apply();
        /* 摇柄每拉一张走 120°，像上发条一样 */
        angle += 120;
        if (arrow) arrow.style.transform = 'rotate(' + angle + 'deg)';
      }

      /* 滑动动画结束后，如果已经滑进副本区域，就悄悄回到起点 */
      track.addEventListener('transitionend', function (e) {
        if (e.target === track && e.propertyName === 'transform' && idx >= count) snapBack();
      });

      /* 窗口尺寸变化时重新测量，并原地停在当前位置 */
      window.addEventListener('resize', function () {
        track.style.transition = 'none';
        measure();
        apply();
        void track.offsetWidth;
        track.style.transition = '';
      });

      function start() {
        measure();
        advance(); /* 启动时先拉一格，给出即时反馈 */
        timer = setInterval(advance, 2200);
        btn.classList.add('active');
        row.classList.add('running'); /* 转动时照片轻轻摆动 */
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', btn.getAttribute('data-stop-label') || '停止转动');
      }

      function stop() {
        clearInterval(timer);
        timer = null;
        btn.classList.remove('active');
        row.classList.remove('running'); /* 停下后恢复静止 */
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', btn.getAttribute('data-start-label') || '启动转动');
      }

      btn.addEventListener('click', function () {
        /* 开启“减少动态效果”时：每点一次只拉一格，不自动循环 */
        if (reduceMotion) { measure(); advance(); return; }
        if (timer) { stop(); } else { start(); }
      });

      measure(); /* 初始先测一次 */
    })(reelBtns[r]);
  }
})();
