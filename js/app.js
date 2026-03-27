(function () {
  "use strict";

  function getConfig() {
    return window.OVEN_CONFIG || {};
  }

  function setText(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function setHref(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(function (node) {
      node.setAttribute("href", value);
    });
  }

  function initBranding() {
    var config = getConfig();
    setText("[data-brand-name]", config.brandName);
    setText("[data-phone-display]", config.phoneDisplay);
    setText("[data-delivery-rule]", config.freeDeliveryRule);
    setHref("[data-phone-href]", config.phoneHref);
    setHref("[data-whatsapp-link]", "https://wa.me/" + (config.whatsappNumber || ""));
  }

  document.addEventListener("DOMContentLoaded", initBranding);
})();
