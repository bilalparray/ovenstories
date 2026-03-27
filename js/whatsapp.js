(function () {
  "use strict";

  function formatCurrency(value) {
    var symbol = (window.OVEN_CONFIG && window.OVEN_CONFIG.currencySymbol) || "INR ";
    return symbol + Number(value || 0);
  }

  function buildOrderLines(cartItems) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return ["- No items"];
    return cartItems.map(function (item) {
      var qty = Number(item.qty) || 0;
      var price = Number(item.price) || 0;
      return "- " + qty + " x " + item.name + " (" + formatCurrency(price * qty) + ")";
    });
  }

  function buildMessage(payload) {
    var cart = payload.cart || [];
    var subtotal = payload.subtotal || 0;
    var lines = [
      "*New Order - Oven Stories*",
      "",
      "*Customer Details*",
      "Name: " + (payload.name || ""),
      "Phone: " + (payload.phone || ""),
      "Order Type: " + (payload.orderType || "Delivery"),
      "Address: " + (payload.address || ""),
      "Landmark: " + (payload.landmark || ""),
      "",
      "*Order Items*"
    ].concat(buildOrderLines(cart)).concat([
      "",
      "*Bill Summary*",
      "Subtotal: " + formatCurrency(subtotal),
      "Delivery: " + (payload.deliveryText || "As per policy"),
      "Total: " + formatCurrency(payload.total || subtotal),
      "",
      "Notes: " + (payload.notes || "None")
    ]);

    return lines.join("\n");
  }

  function getWhatsAppUrl(message) {
    var number = (window.OVEN_CONFIG && window.OVEN_CONFIG.whatsappNumber) || "";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }

  function sendOrder(payload) {
    var message = buildMessage(payload || {});
    var url = getWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    return { message: message, url: url };
  }

  window.OvenWhatsApp = {
    buildMessage: buildMessage,
    getWhatsAppUrl: getWhatsAppUrl,
    sendOrder: sendOrder
  };
})();
