// Элементы страницы
var header = document.getElementById("header");
var burger = document.getElementById("burger");
var navLinks = document.querySelectorAll(".nav__link");
var allAnchors = document.querySelectorAll('a[href^="#"]');

// ---------- Меню на телефоне ----------
function openMenu() {
  header.classList.add("header--open");
  document.body.classList.add("menu-open");
  burger.setAttribute("aria-expanded", "true");
  burger.setAttribute("aria-label", "Закрыть меню");
}

function closeMenu() {
  header.classList.remove("header--open");
  document.body.classList.remove("menu-open");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Открыть меню");
}

burger.addEventListener("click", function () {
  if (header.classList.contains("header--open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// После клика по любой ссылке-якорю закрываем меню
for (var i = 0; i < allAnchors.length; i++) {
  allAnchors[i].addEventListener("click", closeMenu);
}

// Если окно растянули до размера ПК, меню закрываем
window.addEventListener("resize", function () {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

// ---------- Плавная прокрутка к блоку ----------
// В CSS уже есть scroll-behavior: smooth,
// этот код нужен только для старых браузеров (Safari до 15.4).
for (var j = 0; j < allAnchors.length; j++) {
  allAnchors[j].addEventListener("click", function (e) {
    var id = this.getAttribute("href");
    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    var offset = header.offsetHeight - 10;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

    // для подвала прокручиваем просто до конца страницы
    if (id === "#contacts") {
      top = document.documentElement.scrollHeight;
    }
    if (id === "#top") {
      top = 0;
    }

    window.scrollTo({ top: top, behavior: "smooth" });
  });
}

// ---------- Шапка при прокрутке + подсветка пункта меню ----------
var sectionIds = ["products", "advantages", "quality", "custom", "contacts"];

// Блок, на который только что нажали в меню.
// Нужен, потому что последние блоки страницы нельзя прокрутить до верха экрана.
var clickedId = "";

for (var m = 0; m < navLinks.length; m++) {
  navLinks[m].addEventListener("click", function () {
    clickedId = this.getAttribute("href").replace("#", "");
  });
}

// как только человек сам начал крутить - забываем про клик
function forgetClick() {
  clickedId = "";
}
window.addEventListener("wheel", forgetClick);
window.addEventListener("touchmove", forgetClick);
window.addEventListener("keydown", forgetClick);

function onScroll() {
  // шапка становится сплошной
  if (window.pageYOffset > 40) {
    header.classList.add("header--solid");
  } else {
    header.classList.remove("header--solid");
  }

  // ищем, какой блок сейчас на экране
  var current = "";
  for (var k = 0; k < sectionIds.length; k++) {
    var block = document.getElementById(sectionIds[k]);
    if (block.getBoundingClientRect().top <= header.offsetHeight + 120) {
      current = sectionIds[k];
    }
  }

  // дошли до самого низа - значит это подвал
  var bottom = window.pageYOffset + window.innerHeight;
  if (bottom >= document.documentElement.scrollHeight - 5) {
    current = "contacts";
  }

  // если только что нажали на пункт меню - подсвечиваем его
  if (clickedId !== "") {
    current = clickedId;
  }

  for (var n = 0; n < navLinks.length; n++) {
    var isActive = navLinks[n].getAttribute("href") === "#" + current;
    if (isActive) {
      navLinks[n].classList.add("active");
    } else {
      navLinks[n].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", onScroll);
window.addEventListener("load", onScroll);
onScroll();
