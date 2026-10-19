/* =========================================================
   サイト共通スクリプト(全ページで読み込み)
   1. ページ遷移時のスクロール位置リセット
   2. 会社情報(site-config.js)の反映
   3. スマートフォン用メニュー
   4. 同一ページ内アンカーの移動
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. ページ遷移時は必ず一番上から表示する
     ---------------------------------------------------------
     ・リンク/ボタンから別ページへ移動した場合(navigation type = "navigate")
       は、URL に #アンカー が無ければ常に先頭(ヘッダー位置)を表示する。
     ・ブラウザの「戻る・進む」(back_forward)と再読み込み(reload)は
       ブラウザ標準の位置復元をそのまま使う(必要以上に変更しない)。
     ・画像の読み込み完了後にも念のため先頭を再確認する。
       ただし利用者がすでにスクロール操作をしていた場合は動かさない。
  --------------------------------------------------------- */
  function getNavigationType() {
    try {
      var entries = performance.getEntriesByType && performance.getEntriesByType('navigation');
      if (entries && entries.length) return entries[0].type;
      if (performance.navigation) {
        return ['navigate', 'reload', 'back_forward'][performance.navigation.type] || 'navigate';
      }
    } catch (e) { /* 取得できない環境では通常遷移として扱う */ }
    return 'navigate';
  }

  var navType = getNavigationType();
  var userScrolled = false;

  function markUserScroll() { userScrolled = true; }
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, markUserScroll, { passive: true, once: true });
  });

  function resetToTop() {
    if (location.hash) return;          // アンカー付きURLはアンカー位置を優先
    if (userScrolled) return;           // 利用者の操作を邪魔しない
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body && (document.body.scrollTop = 0);
  }

  if (navType === 'navigate' && !location.hash) {
    resetToTop();
    document.addEventListener('DOMContentLoaded', resetToTop);

    /* 表示直後の一定時間は、利用者の操作によらないスクロール
       (プレビュー環境やブラウザ拡張などが前回位置を復元する処理)を
       打ち消して先頭にとどめる。利用者が操作した時点で即終了する。 */
    var guardUntil = Date.now() + 3000;
    var onGuardScroll = function () {
      if (userScrolled || Date.now() > guardUntil) {
        window.removeEventListener('scroll', onGuardScroll);
        return;
      }
      if (window.pageYOffset !== 0) resetToTop();
    };
    window.addEventListener('scroll', onGuardScroll, { passive: true });

    window.addEventListener('load', function () {
      guardUntil = Math.max(guardUntil, Date.now() + 1500);
      resetToTop();
      requestAnimationFrame(resetToTop);
    });
  }

  /* bfcache(戻る操作で前の画面を再表示)のときにメニューが開いたまま
     残らないよう、離脱時に必ず閉じる */
  window.addEventListener('pagehide', function () { closeMenu(false); });

  /* ---------------------------------------------------------
     2. 会社情報を反映
  --------------------------------------------------------- */
  var config = window.SITE_CONFIG || {};

  function applyConfig() {
    var nodes = document.querySelectorAll('[data-field]');
    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute('data-field');
      var value = (config[key] || '').trim();
      if (!value) {
        el.classList.add('demo-field');
        return; // HTML に書かれた「○○を入力」をそのまま表示(リンクにしない)
      }
      el.classList.remove('demo-field');
      var linkType = el.getAttribute('data-link');
      if (linkType === 'tel') {
        var digits = value.replace(/[^\d+]/g, '');
        if (digits.length >= 10) {
          el.textContent = '';
          var a = document.createElement('a');
          a.href = 'tel:' + digits;
          a.textContent = value;
          el.appendChild(a);
          return;
        }
      }
      if (linkType === 'mail' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        el.textContent = '';
        var m = document.createElement('a');
        m.href = 'mailto:' + value;
        m.textContent = value;
        el.appendChild(m);
        return;
      }
      el.textContent = value;
    });
  }

  /* ---------------------------------------------------------
     3. スマートフォン用メニュー
  --------------------------------------------------------- */
  var toggle, nav;

  function openMenu() {
    if (!toggle || !nav) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('.label') && (toggle.querySelector('.label').textContent = '閉じる');
    document.body.classList.add('menu-open');
  }

  function closeMenu(returnFocus) {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.label') && (toggle.querySelector('.label').textContent = 'メニュー');
    document.body.classList.remove('menu-open');
    if (returnFocus) toggle.focus();
  }

  function setupMenu() {
    toggle = document.querySelector('.menu-toggle');
    nav = document.getElementById('global-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeMenu(false); else openMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
    });
    // メニュー内のリンクを押したら必ずメニューを閉じる(スクロール固定を解除)
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    // PC幅に戻したときに閉じる
    window.addEventListener('resize', function () {
      if (window.innerWidth > 880 && nav.classList.contains('is-open')) closeMenu(false);
    });
  }

  /* ---------------------------------------------------------
     4. 同一ページ内アンカー(#contact など)
        別ページへのリンクには一切手を加えない
  --------------------------------------------------------- */
  function setupAnchors() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '#' || href.length < 2) return; // 同一ページ内アンカーのみ対象
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector('.site-header');
      var offset = header ? header.getBoundingClientRect().height : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  function init() {
    applyConfig();
    setupMenu();
    setupAnchors();
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
