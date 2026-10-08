/* =====================================================================
   木崎つかさ ポートフォリオ用スクリプト
   - 作品（LP・画像）のポップアップ表示
   - 動画のポップアップ再生（音声あり）
   - 一覧はサムネイルを表示し、動画はクリック時だけ読み込む
   ===================================================================== */
$(function () {
  "use strict";

  var WORKS = JSON.parse(document.getElementById("kz-works-data").textContent);
  var VIDEOS = JSON.parse(document.getElementById("kz-video-data").textContent);
  var popupOpen = false;
  var popupVideo = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ICON_CLOSE = '<i class="fas fa-times" aria-hidden="true"></i>';
  var ICON_PREV = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';
  var ICON_NEXT = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';

  /* ---------- 作品一覧：ブランド別の絞り込みと追加表示 ---------- */
  document.querySelectorAll(".kz-media-gallery").forEach(function (gallery) {
    var cards = Array.from(gallery.querySelectorAll(".kz-media-card"));
    var filter = gallery.querySelector(".kz-gallery-filter");
    var more = gallery.querySelector(".kz-gallery-more");
    var count = gallery.querySelector(".kz-gallery-count");
    var pageSize = Number(gallery.dataset.pageSize) || 12;
    var limit = pageSize;

    function update(focusNew) {
      var matched = cards.filter(function (card) {
        return filter.value === "all" || card.dataset.brand === filter.value;
      });
      var previouslyVisible = cards.filter(function (card) { return !card.hidden; });
      cards.forEach(function (card) { card.hidden = true; });
      matched.slice(0, limit).forEach(function (card) { card.hidden = false; });
      count.textContent = Math.min(limit, matched.length) + " / " + matched.length + "点";
      more.hidden = limit >= matched.length;
      more.textContent = "もっと見る（残り" + Math.max(0, matched.length - limit) + "点）";
      if (focusNew) {
        var next = matched.slice(0, limit).find(function (card) { return previouslyVisible.indexOf(card) < 0; });
        if (next) next.querySelector("a, button").focus({ preventScroll: true });
      }
    }
    filter.addEventListener("change", function () { limit = pageSize; update(false); });
    more.addEventListener("click", function () { limit += pageSize; update(true); });
    update(false);
  });

  /* ---------- ポップアップの中身を組み立てる ---------- */

  function headHtml(title, desc, tabs, nav) {
    return (
      '<div class="kz-viewer-head">' +
      "<div>" +
      '<p class="kz-viewer-title" lang="ja">' + esc(title) + "</p>" +
      (desc ? '<p class="kz-viewer-desc" lang="ja">' + esc(desc) + "</p>" : "") +
      (tabs || "") +
      "</div>" +
      '<div class="kz-viewer-actions">' +
      (nav || "") +
      '<button type="button" class="kz-icon-btn kz-close" aria-label="閉じる">' + ICON_CLOSE + "</button>" +
      "</div>" +
      "</div>"
    );
  }

  function navHtml(count) {
    if (count < 2) return "";
    return (
      '<button type="button" class="kz-icon-btn kz-prev" aria-label="前へ">' + ICON_PREV + "</button>" +
      '<button type="button" class="kz-icon-btn kz-next" aria-label="次へ">' + ICON_NEXT + "</button>"
    );
  }

  function workItems(key) {
    var w = WORKS[key];
    var isBanner = key === "banners";
    var desc = isBanner ? "" : [w.role, w.desc].filter(Boolean).join("\n");

    return w.items.map(function (it, i) {
      var tabs = "";
      if (!isBanner && w.items.length > 1) {
        tabs = '<div class="kz-tabs" role="tablist">' +
          w.items.map(function (t, j) {
            return '<button type="button" role="tab" class="kz-tab' + (i === j ? " is-active" : "") +
              '" data-goto="' + j + '" aria-selected="' + (i === j) + '">' + esc(t.label) + "</button>";
          }).join("") + "</div>";
      }
      var title = isBanner ? it.label : w.title;
      var nav = isBanner ? navHtml(w.items.length) : "";

      var imgs = it.parts.map(function (p, k) {
        return '<img src="' + p.src + '" width="' + it.w + '" height="' + p.h + '" alt="' +
          (k === 0 ? esc(title + " " + it.label) : "") + '"' + (k > 1 ? ' loading="lazy"' : "") +
          ' decoding="async" />';
      }).join("");

      var html =
        '<div class="kz-viewer">' +
        headHtml(title, desc, tabs, nav) +
        '<div class="kz-viewer-body' + (it.kind === "img" ? " is-img" : "") + '" style="max-width:' + it.disp + 'px">' +
        imgs + "</div></div>";
      return { src: html, type: "inline" };
    });
  }

  function videoItems(group) {
    var list = VIDEOS[group];
    return list.map(function (v) {
      var html =
        '<div class="kz-viewer">' +
        headHtml(v.title, v.caption, "", navHtml(list.length)) +
        '<div class="kz-viewer-body">' +
        '<video class="' + (v.ratio === "16x9" ? "is-wide" : "") + '" controls autoplay playsinline preload="auto" poster="' + v.poster + '">' +
        '<source src="' + v.src + '" type="video/mp4" /></video>' +
        "</div></div>";
      return { src: html, type: "inline" };
    });
  }

  /* ---------- ポップアップを開く ---------- */

  function pauseAll(scope) {
    $(scope || document).find("video").each(function () {
      this.pause();
    });
  }

  function openPopup(items, index) {
    var returnFocus = document.activeElement;
    $.magnificPopup.open({
      items: items,
      gallery: { enabled: items.length > 1, arrows: false, preload: [0, 0] },
      mainClass: "kz-mfp",
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: "auto",
      showCloseBtn: false,
      closeOnBgClick: false,
      closeOnContentClick: false,
      removalDelay: 0,
      autoFocusLast: false,
      focus: ".kz-close",
      callbacks: {
        open: function () {
          popupOpen = true;
          pauseAll("main");
        },
        change: function () {
          var wrap = this.wrap;
          setTimeout(function () {
            if (wrap) wrap.scrollTop(0);
          }, 0);
        },
        afterChange: function () {
          var c = this.content;
          // 前に表示していた動画を止めて、今の動画を再生する
          if (popupVideo) popupVideo.pause();
          popupVideo = c ? c.find("video")[0] || null : null;
          if (popupVideo) {
            var p = popupVideo.play();
            if (p && p.catch) p.catch(function () {});
          }
          var closeButton = c && c.find(".kz-close")[0];
          if (closeButton) closeButton.focus({ preventScroll: true });
        },
        beforeClose: function () {
          if (popupVideo) popupVideo.pause();
          popupVideo = null;
        },
        close: function () {
          popupOpen = false;
        },
        afterClose: function () {
          if (returnFocus && returnFocus.isConnected) {
            returnFocus.focus({ preventScroll: true });
          }
        },
      },
    }, index || 0);
  }

  // 作品（グリッド・リスト・バナー）
  $(document).on("click", "[data-work]", function (e) {
    e.preventDefault();
    var key = $(this).data("work");
    if (!WORKS[key]) return;
    openPopup(workItems(key), parseInt($(this).data("index") || 0, 10));
  });

  $(document).on("keydown", ".item-row[data-work]", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $(this).trigger("click");
    }
  });

  $(".kz-open-banners").on("click", function () {
    openPopup(workItems("banners"), 0);
  });

  // 動画
  $(document).on("click", "[data-video-group]", function (e) {
    e.preventDefault();
    var group = $(this).data("video-group");
    if (!VIDEOS[group]) return;
    openPopup(videoItems(group), parseInt($(this).data("index") || 0, 10));
  });

  // ポップアップ内のボタン
  $(document).on("click", ".kz-viewer .kz-close", function () {
    $.magnificPopup.close();
  });
  $(document).on("click", ".kz-viewer .kz-prev", function () {
    $.magnificPopup.instance.prev();
  });
  $(document).on("click", ".kz-viewer .kz-next", function () {
    $.magnificPopup.instance.next();
  });
  $(document).on("click", ".kz-viewer .kz-tab", function () {
    $.magnificPopup.instance.goTo(parseInt($(this).data("goto"), 10));
  });

  // 背景クリックで閉じる（中身の外側だけ）
  $(document).on("click", ".kz-mfp .mfp-container", function (e) {
    if (e.target === this) $.magnificPopup.close();
  });

  /* ---------- 縦型動画スライダー：自動送りを止める ---------- */

  (function () {
    var el = document.querySelector(".kz-shorts .swiper-container");
    if (el && el.swiper && el.swiper.autoplay) el.swiper.autoplay.stop();
  })();

  /* ---------- スマホのメニュー：リンクを押したら閉じる ---------- */

  $(".navbar .nav-link, .navbar .kz-logo").on("click", function () {
    $(".navbar .navbar-collapse").removeClass("show");
    $(".navbar .navbar-toggler").attr("aria-expanded", "false");
  });

});
