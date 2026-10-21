(function () {
  var facebookPage = document.querySelector(".social-live-feed--facebook .fb-page");
  if (!facebookPage) return;

  function fitFacebookWidth() {
    var host = facebookPage.parentElement;
    if (!host) return;
    var width = Math.floor(host.getBoundingClientRect().width);
    if (width < 180) return;
    facebookPage.setAttribute("data-width", String(width));
    if (window.FB && FB.XFBML && FB.XFBML.parse) {
      FB.XFBML.parse(host);
    }
  }

  window.addEventListener("load", function () {
    fitFacebookWidth();
    window.setTimeout(fitFacebookWidth, 1200);
  });
  window.addEventListener("resize", fitFacebookWidth);
})();
