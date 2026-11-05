(function () {
  var facebookPage = document.querySelector(".social-live-feed--facebook .fb-page");
  if (!facebookPage) return;

  function fitFacebook() {
    var host = facebookPage.parentElement;
    if (!host) return;
    var width = Math.min(500, Math.floor(host.getBoundingClientRect().width));
    var height = Math.floor(host.getBoundingClientRect().height);
    if (width < 180 || height < 180) return;
    if (
      facebookPage.getAttribute("data-width") === String(width) &&
      facebookPage.getAttribute("data-height") === String(height)
    ) {
      return;
    }
    facebookPage.setAttribute("data-width", String(width));
    facebookPage.setAttribute("data-height", String(height));
    if (window.FB && FB.XFBML && FB.XFBML.parse) {
      FB.XFBML.parse(host);
    }
  }

  window.addEventListener("load", function () {
    fitFacebook();
    window.setTimeout(fitFacebook, 1200);
  });
  window.addEventListener("resize", fitFacebook);
})();
