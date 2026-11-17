/* ==========================================================
   JavaScript Labs – main.js
   Chỉ dùng JavaScript thuần (không cần jQuery) cho trang chủ.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initMenu();
  initAvatar();
  initCart();
  initWordCount();
  initActiveNav();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- 1. Chuyển giao diện sáng/tối ---------- */
function initTheme() {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");

  // Đọc lựa chọn đã lưu (nếu trình duyệt cho phép)
  try {
    var saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) { /* bỏ qua nếu không dùng được localStorage */ }

  btn.addEventListener("click", function () {
    var isDark =
      root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

/* ---------- 2. Menu trên điện thoại ---------- */
function initMenu() {
  var btn = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");

  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  // Chọn một mục thì đóng menu
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- 3. Ảnh đại diện: lỗi/không có ảnh thì hiện chữ cái đầu ---------- */
function initAvatar() {
  var img = document.getElementById("avatar-img");
  if (!img) return;
  img.addEventListener("error", function () {
    img.hidden = true;
  });
}

/* ---------- 4. Giỏ hàng mini (DOM + Events) ---------- */
function initCart() {
  var list = document.getElementById("cart-list");
  if (!list) return;
  var totalEl = document.getElementById("cart-total");
  var msgEl = document.getElementById("cart-msg");
  var clearBtn = document.getElementById("cart-clear");

  function formatVND(n) {
    return n.toLocaleString("vi-VN") + " ₫";
  }

  function update() {
    var total = 0;
    var count = 0;
    list.querySelectorAll("li").forEach(function (li) {
      var qty = Number(li.querySelector("output").textContent);
      total += qty * Number(li.dataset.price);
      count += qty;
    });
    totalEl.textContent = formatVND(total);
    msgEl.textContent =
      count === 0
        ? "Giỏ hàng trống. Bấm + để thêm sản phẩm."
        : "Có " + count + " sản phẩm trong giỏ.";
  }

  // Một trình nghe sự kiện cho cả danh sách (event delegation)
  list.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var output = btn.closest("li").querySelector("output");
    var qty = Number(output.textContent);
    qty = btn.dataset.action === "inc" ? qty + 1 : Math.max(0, qty - 1);
    output.textContent = qty;
    update();
  });

  clearBtn.addEventListener("click", function () {
    list.querySelectorAll("output").forEach(function (o) { o.textContent = "0"; });
    update();
  });

  update();
}

/* ---------- 5. Đếm từ cho phần tự đánh giá (yêu cầu 100–150 từ) ---------- */
/* Có thể xóa hàm này (và dòng gọi ở trên) khi bạn không cần nữa. */
function initWordCount() {
  var text = document.getElementById("review-text");
  var out = document.getElementById("word-count");
  if (!text || !out) return;

  var words = text.textContent.trim().split(/\s+/).filter(Boolean).length;
  out.textContent = "Số từ hiện tại: " + words + " (yêu cầu khoảng 100–150 từ)";
  out.classList.toggle("ok", words >= 100 && words <= 150);
  out.classList.toggle("warn", words < 100 || words > 150);
}

/* ---------- 6. Tô sáng mục menu theo phần đang xem ---------- */
function initActiveNav() {
  var links = document.querySelectorAll(".site-nav a");
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

  if (!("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          links.forEach(function (a) { a.classList.remove("active"); });
          map[entry.target.id].classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  Object.keys(map).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
