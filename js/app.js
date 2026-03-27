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

  function initWhatsAppOrderForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!window.OvenWhatsApp || typeof window.OvenWhatsApp.sendOrder !== "function") {
        alert("WhatsApp checkout is unavailable right now.");
        return;
      }

      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var phone = (form.querySelector('[name="phone"]') || {}).value || "";
      var address = (form.querySelector('[name="address"]') || {}).value || "";
      var persons = (form.querySelector('[name="persons"]') || {}).value || "";
      var preferredTime = (form.querySelector('[name="preferredTime"]') || {}).value || "";
      var notes = (form.querySelector('[name="notes"]') || {}).value || "";

      var extraNotes = [];
      if (persons) extraNotes.push("People: " + persons);
      if (preferredTime) extraNotes.push("Preferred time: " + preferredTime);
      if (notes) extraNotes.push("Message: " + notes);

      window.OvenWhatsApp.sendOrder({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        orderType: "Delivery",
        cart: [],
        subtotal: 0,
        total: 0,
        deliveryText: (getConfig() && getConfig().freeDeliveryRule) || "As per policy",
        notes: extraNotes.join(" | ")
      });

      if (formId === "modalWhatsAppForm") {
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
          window.jQuery("#bookingForm_model").modal("hide");
        } else {
          var modal = document.getElementById("bookingForm_model");
          if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
          }
          document.querySelectorAll(".modal-backdrop").forEach(function (el) {
            el.parentNode.removeChild(el);
          });
          document.body.classList.remove("modal-open");
          document.body.style.removeProperty("padding-right");
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBranding();
    initWhatsAppOrderForm("homeWhatsAppForm");
    initWhatsAppOrderForm("modalWhatsAppForm");
  });
})();
