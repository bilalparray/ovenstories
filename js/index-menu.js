(function () {
  "use strict";

  function formatPrice(value) {
    var symbol = (window.OVEN_CONFIG && window.OVEN_CONFIG.currencySymbol) || "INR ";
    return symbol + Number(value || 0);
  }

  function loadJson(url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .catch(function () {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (err) {
                reject(err);
              }
            } else {
              reject(new Error("XHR failed"));
            }
          };
          xhr.send();
        });
      });
  }

  function createTabLink(categoryId, categoryName, active) {
    var li = document.createElement("li");
    li.className = "nav-item";
    var a = document.createElement("a");
    a.className = "nav-link" + (active ? " active" : "");
    a.id = "home-tab-" + categoryId;
    a.setAttribute("data-toggle", "tab");
    a.href = "#home-pane-" + categoryId;
    a.setAttribute("role", "tab");
    a.setAttribute("aria-controls", "home-pane-" + categoryId);
    a.setAttribute("aria-selected", active ? "true" : "false");
    a.textContent = categoryName;
    li.appendChild(a);
    return li;
  }

  function createDishCard(item) {
    var col = document.createElement("div");
    col.className = "col-lg-6 col-md-12";
    var servesLine = item.person ? '<p><small>Serves: ' + item.person + "</small></p>" : "";
    var badge = item.isAvailable ? "POPULAR" : "UNAVAILABLE";
    var productUrl = "product.html?id=" + encodeURIComponent(item.id);
    col.innerHTML =
      '<div class="dish_box" data-product-url="' + productUrl + '">' +
      '  <span class="new">' + badge + "</span>" +
      '  <div class="dish_info">' +
      '    <div class="dish_img">' +
      '      <a href="' + productUrl + '"><img src="' + (item.image || "images/dish_01.webp") + '" alt="' + item.name + '" /></a>' +
      "    </div>" +
      '    <div class="dish_text">' +
      '      <h3><a href="' + productUrl + '">' + item.name + "</a></h3>" +
      "      <p>" + (item.description || "") + "</p>" +
      servesLine +
      '      <div class="price_cart">' +
      '        <span class="price">' + formatPrice(item.price) + "</span>" +
      '        <a href="' + productUrl + '">' +
      '          <span class="cart_btn"><i class="icofont-arrow-right"></i></span>' +
      "        </a>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</div>";
    return col;
  }

  function createTabPane(category, active) {
    var pane = document.createElement("div");
    pane.className = "tab-pane fade" + (active ? " show active" : "");
    pane.id = "home-pane-" + category.id;
    pane.setAttribute("role", "tabpanel");
    pane.setAttribute("aria-labelledby", "home-tab-" + category.id);

    var inner = document.createElement("div");
    inner.className = "container";
    var row = document.createElement("div");
    row.className = "row";

    if (Array.isArray(category.items) && category.items.length) {
      category.items.slice(0, 2).forEach(function (item) {
        row.appendChild(createDishCard(item));
      });
    } else {
      var empty = document.createElement("div");
      empty.className = "col-12";
      empty.innerHTML =
        '<div class="dish_box"><div class="dish_info"><div class="dish_text">' +
        "<h3>" + category.name + " coming soon</h3>" +
        "<p>New items in this category will be available shortly.</p>" +
        "</div></div></div>";
      row.appendChild(empty);
    }

    var ctaWrap = document.createElement("div");
    ctaWrap.className = "text-center";
    ctaWrap.innerHTML = '<a href="menu.html" class="btn btn_primary">view full menu</a>';

    inner.appendChild(row);
    inner.appendChild(ctaWrap);
    pane.appendChild(inner);
    return pane;
  }

  function renderHomeMenu(menuData) {
    var tabs = document.getElementById("homeMenuTabs");
    var content = document.getElementById("homeMenuTabContent");
    if (!tabs || !content) return;

    var categories = (menuData && menuData.categories) || [];
    tabs.innerHTML = "";
    content.innerHTML = "";

    categories.forEach(function (category, index) {
      var isActive = index === 0;
      tabs.appendChild(createTabLink(category.id, category.name, isActive));
      content.appendChild(createTabPane(category, isActive));
    });

    content.querySelectorAll("[data-product-url]").forEach(function (card) {
      card.addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        var url = card.getAttribute("data-product-url");
        if (url) window.location.href = url;
      });
    });
  }

  function init() {
    if (!document.getElementById("homeMenuTabs")) return;
    loadJson("data/menu.json")
      .then(renderHomeMenu)
      .catch(function () {
        var tabs = document.getElementById("homeMenuTabs");
        var content = document.getElementById("homeMenuTabContent");
        if (tabs) tabs.innerHTML = "";
        if (content) {
          content.innerHTML = '<div class="text-center"><p>Unable to load menu preview right now.</p></div>';
        }
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
