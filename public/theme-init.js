(function () {
  var t = localStorage.getItem("theme");
  var dark = t ? t === "dark" : true;
  if (dark) document.documentElement.classList.add("dark");
})();
