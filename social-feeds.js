(function () {
  var facebookPage = document.querySelector(".social-live-feed--facebook .fb-page");
  var instagramFrame = document.querySelector(".social-live-iframe--instagram");

  function fitFacebookWidth() {
    if (!facebookPage) return;
    var host = facebookPage.parentElement;
    if (!host) return;
    var width = Math.min(500, Math.floor(host.getBoundingClientRect().width));
    if (width < 180) return;
    if (facebookPage.getAttribute("data-width") === String(width)) return;
    facebookPage.setAttribute("data-width", String(width));
    if (window.FB && FB.XFBML && FB.XFBML.parse) {
      FB.XFBML.parse(host);
    }
  }

  function fitInstagram() {
    if (!instagramFrame) return;
    var host = instagramFrame.parentElement;
    if (!host) return;
    var naturalWidth = 540;
    var naturalHeight = 700;
    var scale = host.clientWidth / naturalWidth;
    if (!(scale > 0)) return;
    instagramFrame.style.width = naturalWidth + "px";
    instagramFrame.style.height = naturalHeight + "px";
    instagramFrame.style.transform = "scale(" + scale + ")";
    host.style.height = Math.ceil(naturalHeight * scale) + "px";
  }

  function fitSocial() {
    fitFacebookWidth();
    fitInstagram();
  }

  window.addEventListener("load", function () {
    fitSocial();
    window.setTimeout(fitSocial, 400);
  });
  window.addEventListener("resize", fitSocial);
  if (document.readyState !== "loading") fitSocial();
})();
