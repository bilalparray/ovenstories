(function () {
  "use strict";

  var state = {
    menuData: null,
    activeCategory: "all",
    query: "",
  };

  function flattenItems(data) {
    if (!data || !Array.isArray(data.categories)) return [];
    return data.categories.reduce(function (acc, category) {
      var items = Array.isArray(category.items) ? category.items : [];
      var normalized = items.map(function (item) {
        return Object.assign({}, item, {
          categoryId: category.id,
          categoryName: category.name,
        });
      });
      return acc.concat(normalized);
    }, []);
  }

  function formatPrice(value) {
    var symbol =
      (window.OVEN_CONFIG && window.OVEN_CONFIG.currencySymbol) || "INR ";
    return symbol + Number(value || 0);
  }

  function filteredItems() {
    var items = flattenItems(state.menuData);
    return items.filter(function (item) {
      var inCategory =
        state.activeCategory === "all" ||
        item.categoryId === state.activeCategory;
      var q = state.query.trim().toLowerCase();
      var inQuery =
        !q ||
        item.name.toLowerCase().indexOf(q) !== -1 ||
        (item.description || "").toLowerCase().indexOf(q) !== -1;
      return inCategory && inQuery;
    });
  }

  function updateCartCount() {
    var countNode = document.getElementById("menuCartCount");
    if (!countNode || !window.OvenCart) return;
    var count = window.OvenCart.read().reduce(function (acc, item) {
      return acc + (Number(item.qty) || 0);
    }, 0);
    countNode.textContent = String(count);
  }

  function getDeliveryCharge(subtotal, orderType) {
    if (orderType === "pickup") return 0;
    return subtotal >= 499 ? 0 : 50;
  }

  function getOrderType() {
    var node = document.getElementById("orderType");
    return node ? node.value : "delivery";
  }

  function updateCheckoutTotals() {
    var subtotalNode = document.getElementById("checkoutSubtotal");
    var deliveryNode = document.getElementById("checkoutDelivery");
    var totalNode = document.getElementById("checkoutTotal");
    var ruleNode = document.getElementById("deliveryRuleText");
    if (!subtotalNode || !deliveryNode || !totalNode) return;

    var subtotal = window.OvenCart ? window.OvenCart.getSubtotal() : 0;
    var delivery = getDeliveryCharge(subtotal, getOrderType());
    var total = subtotal + delivery;
    subtotalNode.textContent = formatPrice(subtotal);
    deliveryNode.textContent = formatPrice(delivery);
    totalNode.textContent = formatPrice(total);
    if (ruleNode && window.OVEN_CONFIG) {
      ruleNode.textContent = window.OVEN_CONFIG.freeDeliveryRule || "";
    }
  }

  function updateAddressFieldByOrderType() {
    var orderType = getOrderType();
    var addressInput = document.getElementById("customerAddress");
    if (!addressInput) return;
    if (orderType === "pickup") {
      addressInput.required = false;
      addressInput.placeholder = "Address not required for pickup";
    } else {
      addressInput.required = true;
      addressInput.placeholder = "Delivery Address";
    }
  }

  function renderCart() {
    var listNode = document.getElementById("cartItemList");
    var emptyNode = document.getElementById("cartEmptyState");
    if (!listNode || !emptyNode || !window.OvenCart) return;

    var cart = window.OvenCart.read();
    listNode.innerHTML = "";
    emptyNode.style.display = cart.length ? "none" : "block";

    cart.forEach(function (item) {
      var lineTotal = (Number(item.price) || 0) * (Number(item.qty) || 0);
      var li = document.createElement("li");
      li.innerHTML =
        '<div class="info">' +
        '  <div class="mainCource">' +
        '    <div class="dishName"><h4>' +
        item.name +
        "</h4></div>" +
        '    <div class="doted"></div>' +
        '    <span class="price">' +
        formatPrice(lineTotal) +
        "</span>" +
        "  </div>" +
        '  <div class="description">' +
        "    <p>Qty: " +
        '<button type="button" class="btn btn-sm btn_border mx-1" data-cart-action="dec" data-id="' +
        item.id +
        '">-</button>' +
        "<span>" +
        item.qty +
        "</span>" +
        '<button type="button" class="btn btn-sm btn_border mx-1" data-cart-action="inc" data-id="' +
        item.id +
        '">+</button>' +
        '<button type="button" class="btn btn-sm btn_border ml-2" data-cart-action="remove" data-id="' +
        item.id +
        '">Remove</button>' +
        "</p>" +
        "  </div>" +
        "</div>";
      listNode.appendChild(li);
    });

    listNode.querySelectorAll("[data-cart-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var id = button.getAttribute("data-id");
        var action = button.getAttribute("data-cart-action");
        var existing = window.OvenCart.read().find(function (entry) {
          return entry.id === id;
        });
        if (!existing) return;

        if (action === "inc") {
          window.OvenCart.updateQty(id, Number(existing.qty) + 1);
        } else if (action === "dec") {
          if (Number(existing.qty) <= 1) {
            window.OvenCart.removeItem(id);
          } else {
            window.OvenCart.updateQty(id, Number(existing.qty) - 1);
          }
        } else if (action === "remove") {
          window.OvenCart.removeItem(id);
        }
        renderCart();
        updateCartCount();
        updateCheckoutTotals();
      });
    });
  }

  function showCheckoutError(message) {
    var node = document.getElementById("checkoutError");
    if (!node) return;
    node.style.display = message ? "block" : "none";
    node.textContent = message || "";
  }

  function showCheckoutSuccess(message) {
    var node = document.getElementById("checkoutSuccess");
    if (!node) return;
    node.style.display = message ? "block" : "none";
    node.textContent = message || "";
  }

  function validPhone(value) {
    return /^\+?[0-9]{10,14}$/.test(String(value || "").trim());
  }

  function bindCheckout() {
    var form = document.getElementById("checkoutForm");
    var orderType = document.getElementById("orderType");
    if (orderType) {
      orderType.addEventListener("change", function () {
        updateAddressFieldByOrderType();
        updateCheckoutTotals();
      });
    }
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showCheckoutError("");
      showCheckoutSuccess("");

      var cart = window.OvenCart ? window.OvenCart.read() : [];
      if (!cart.length) {
        showCheckoutError("Your cart is empty.");
        return;
      }

      var name = (document.getElementById("customerName") || {}).value || "";
      var phone = (document.getElementById("customerPhone") || {}).value || "";
      var address =
        (document.getElementById("customerAddress") || {}).value || "";
      var landmark =
        (document.getElementById("customerLandmark") || {}).value || "";
      var notes = (document.getElementById("customerNotes") || {}).value || "";
      var selectedOrderType = getOrderType();

      if (!name.trim() || !phone.trim()) {
        showCheckoutError("Please fill name and phone.");
        return;
      }
      if (selectedOrderType === "delivery" && !address.trim()) {
        showCheckoutError("Please fill your delivery address.");
        return;
      }
      if (!validPhone(phone)) {
        showCheckoutError("Please enter a valid phone number.");
        return;
      }

      var subtotal = window.OvenCart.getSubtotal();
      var delivery = getDeliveryCharge(subtotal, selectedOrderType);
      var total = subtotal + delivery;

      if (!window.OvenWhatsApp) {
        showCheckoutError("WhatsApp checkout is unavailable right now.");
        return;
      }

      window.OvenWhatsApp.sendOrder({
        name: name.trim(),
        phone: phone.trim(),
        orderType: selectedOrderType,
        address: address.trim(),
        landmark: landmark.trim(),
        notes: notes.trim(),
        cart: cart,
        subtotal: subtotal,
        total: total,
        deliveryText: formatPrice(delivery),
      });
      showCheckoutSuccess(
        "WhatsApp opened with your order. Please tap send in WhatsApp to confirm.",
      );
    });
  }

  function createCategoryButton(id, name) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "btn " + (state.activeCategory === id ? "btn_primary" : "btn_border");
    btn.style.margin = "6px";
    btn.textContent = name;
    btn.addEventListener("click", function () {
      state.activeCategory = id;
      render();
    });
    return btn;
  }

  function renderFilters() {
    var wrapper = document.getElementById("menuCategoryFilters");
    if (!wrapper || !state.menuData) return;
    wrapper.innerHTML = "";
    wrapper.appendChild(createCategoryButton("all", "All"));
    (state.menuData.categories || []).forEach(function (category) {
      wrapper.appendChild(createCategoryButton(category.id, category.name));
    });
  }

  function renderList() {
    var container = document.getElementById("menuListContainer");
    var emptyState = document.getElementById("menuEmptyState");
    if (!container || !emptyState) return;

    var items = filteredItems();
    container.innerHTML = "";
    emptyState.style.display = items.length ? "none" : "block";

    items.forEach(function (item) {
      var col = document.createElement("div");
      col.className = "col-md-6 col-lg-4 mb-4";
      col.innerHTML =
        '<div class="popular_dish_item h-100">' +
        '  <div class="img"><img src="' +
        (item.image || "images/menulistSub_01.png") +
        '" alt="' +
        item.name +
        '"></div>' +
        '  <div class="text">' +
        "    <h3>" +
        item.name +
        "</h3>" +
        "    <p>" +
        (item.description || "") +
        "</p>" +
        "    <p><strong>" +
        formatPrice(item.price) +
        "</strong></p>" +
        "    <p>" +
        (item.isAvailable ? "Available" : "Out of stock") +
        "</p>" +
        "  </div>" +
        "  <div>" +
        '    <button class="btn btn_primary w-100" ' +
        (item.isAvailable ? "" : "disabled") +
        ' data-item-id="' +
        item.id +
        '">Add to Cart</button>' +
        "  </div>" +
        "</div>";
      container.appendChild(col);
    });

    container.querySelectorAll("[data-item-id]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!window.OvenCart) return;
        var itemId = button.getAttribute("data-item-id");
        var item = flattenItems(state.menuData).find(function (entry) {
          return entry.id === itemId;
        });
        if (!item) return;
        window.OvenCart.addItem({
          id: item.id,
          name: item.name,
          price: item.price,
        });
        renderCart();
        updateCartCount();
        updateCheckoutTotals();
      });
    });
  }

  function render() {
    renderFilters();
    renderList();
    renderCart();
    updateCartCount();
    updateCheckoutTotals();
  }

  function bindSearch() {
    var input = document.getElementById("menuSearchInput");
    if (!input) return;
    input.addEventListener("input", function () {
      state.query = input.value || "";
      renderList();
    });
  }

  function init() {
    if (!document.getElementById("menuListContainer")) return;
    bindCheckout();
    updateAddressFieldByOrderType();
    renderCart();
    updateCartCount();
    updateCheckoutTotals();

    fetch("data/menu.json")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        state.menuData = data;
        bindSearch();
        render();
      })
      .catch(function () {
        var container = document.getElementById("menuListContainer");
        if (container) {
          container.innerHTML =
            '<div class="col-12 text-center"><p>Unable to load menu right now.</p></div>';
        }
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
