(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var year = document.getElementById("yr");
  if (year) year.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-condensed", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("site-nav");
  if (toggle && panel) {
    var label = toggle.querySelector(".sr-only");
    var setOpen = function (open) {
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    };
    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(!panel.classList.contains("is-open"));
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("click", function (event) {
      if (!panel.classList.contains("is-open")) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  function mountVideo(video) {
    if (!video) return;
    var min = parseInt(video.getAttribute("data-min-width") || "0", 10);
    var wideEnough = window.innerWidth >= min;
    if (!wideEnough) {
      if (!video.paused) video.pause();
      return;
    }
    if (reduce || video.dataset.ready === "1") {
      if (!reduce && video.dataset.ready === "1" && video.paused) {
        video.play().catch(function () {});
      }
      return;
    }
    var webm = video.getAttribute("data-webm");
    var mp4 = video.getAttribute("data-mp4");
    if (webm) {
      var webmSource = document.createElement("source");
      webmSource.src = webm;
      webmSource.type = "video/webm";
      video.appendChild(webmSource);
    }
    if (mp4) {
      var mp4Source = document.createElement("source");
      mp4Source.src = mp4;
      mp4Source.type = "video/mp4";
      video.appendChild(mp4Source);
    }
    video.dataset.ready = "1";
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.addEventListener("playing", function () {
      video.classList.add("is-playing");
    });
    video.play().catch(function () {});
  }

  document.querySelectorAll("video[data-mp4]").forEach(function (video) {
    var min = parseInt(video.getAttribute("data-min-width") || "0", 10);
    if (min > 0 || !("IntersectionObserver" in window)) {
      mountVideo(video);
      return;
    }
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        mountVideo(entry.target);
        watch.unobserve(entry.target);
      });
    }, { rootMargin: "240px" });
    watch.observe(video);
  });
  window.addEventListener("resize", function () {
    document.querySelectorAll("video[data-mp4]").forEach(mountVideo);
  });

  if (!reduce && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  // Thin scroll-progress line under the header.
  if (header) {
    var setProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty("--progress", max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    setProgress();
    window.addEventListener("scroll", setProgress, { passive: true });
    window.addEventListener("resize", setProgress);
  }

  // Visitor's time next to Manila's, refreshed every 30 s.
  var clock = document.querySelector("[data-clock]");
  if (clock && window.Intl) {
    var fmt = function (zone) {
      return new Date().toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", timeZone: zone });
    };
    var tick = function () {
      clock.querySelector("[data-time-local]").textContent = fmt(undefined);
      clock.querySelector("[data-time-manila]").textContent = fmt("Asia/Manila");
    };
    try { tick(); clock.hidden = false; setInterval(tick, 30000); } catch (e) { /* old browser: keep it hidden */ }
  }

  // Savings calculator: same per-person figures as the price table.
  var calc = document.querySelector("[data-calc]");
  if (calc) {
    var OURS = 15600, HOURS = 2080; // per full-time specialist per year
    var money = function (n) { return "$" + Math.round(n).toLocaleString("en-CA"); };
    var staff = document.getElementById("calc-staff");
    var staffOut = document.getElementById("calc-staff-out");
    var update = function () {
      var n = parseInt(staff.value, 10);
      var base = parseInt(calc.querySelector("input[name=calc-base]:checked").value, 10);
      staffOut.textContent = String(n);
      staff.style.setProperty("--fill", ((n - 1) / (staff.max - 1)) * 100 + "%");
      calc.querySelector("[data-calc-local]").textContent = money(base * n);
      calc.querySelector("[data-calc-ours]").textContent = money(OURS * n);
      calc.querySelector("[data-calc-save]").textContent = money((base - OURS) * n);
      calc.querySelector("[data-calc-wait]").textContent = money(((base - OURS) * n) / 12);
      var rate = Math.max(0, Math.min(2000, parseFloat(document.getElementById("calc-rate").value) || 0));
      calc.querySelector("[data-calc-hours]").textContent = (HOURS * n).toLocaleString("en-CA");
      calc.querySelector("[data-calc-time]").textContent = money(HOURS * n * rate);
      calc.querySelector("[data-calc-perk]").hidden = n < 6;
    };
    calc.addEventListener("input", update);
    update();
    calc.hidden = false;
  }

  // Phone-only sticky call button: shows after the hero, hides at the contact section.
  var bar = document.querySelector("[data-mobile-cta]");
  var hero = document.querySelector(".hero, .page-hero");
  if (bar && hero && "IntersectionObserver" in window) {
    var heroGone = false, endIn = {};
    var sync = function () {
      var atEnd = Object.keys(endIn).some(function (k) { return endIn[k]; });
      bar.classList.toggle("is-shown", heroGone && !atEnd);
    };
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting; sync(); }).observe(hero);
    // Hide over the contact section and footer so it never covers them.
    [document.getElementById("contact") || document.querySelector(".close"), document.querySelector(".site-footer")].forEach(function (el, i) {
      if (el) new IntersectionObserver(function (e) { endIn[i] = e[0].isIntersecting; sync(); }).observe(el);
    });
  }

})();
