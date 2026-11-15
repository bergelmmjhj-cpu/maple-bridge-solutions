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

  var form = document.getElementById("mailform");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) return;
    event.preventDefault();
    var value = function (id) {
      var field = document.getElementById(id);
      return field ? field.value.trim() : "";
    };
    var company = value("f-company");
    var subject = "Enquiry: " + value("f-service") + (company ? " (" + company + ")" : "");
    var body = "Name: " + value("f-name") + "\nBusiness: " + company + "\nInterested in: " + value("f-service") + "\n\n" + value("f-msg");
    window.location.href = "mailto:northislepartners@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
