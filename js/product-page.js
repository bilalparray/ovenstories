(function () {
  "use strict";

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

  function getProductId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function findProduct(menuData, productId) {
    if (!menuData || !Array.isArray(menuData.categories)) return null;
    for (var i = 0; i < menuData.categories.length; i++) {
      var category = menuData.categories[i];
      var items = Array.isArray(category.items) ? category.items : [];
      for (var j = 0; j < items.length; j++) {
        if (items[j].id === productId) {
          return Object.assign({}, items[j], { categoryName: category.name });
        }
      }
    }
    return null;
  }

  function formatPrice(value) {
    var symbol = (window.OVEN_CONFIG && window.OVEN_CONFIG.currencySymbol) || "INR ";
    return symbol + Number(value || 0);
  }

  function setText(id, text) {
    var node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function renderProduct(product) {
    document.title = (product.name || "Product") + " | Oven Stories";
    setText("productTitle", product.name || "Product Details");
    setText("productCategoryLine", "Category: " + (product.categoryName || ""));
    setText("productName", product.name || "");
    setText("productPrice", formatPrice(product.price));
    setText("productDescription", product.description || "No description available.");
    setText("productPerson", product.person ? "Serves: " + product.person : "");
    setText("productAvailability", product.isAvailable ? "Available now" : "Currently unavailable");

    var imageNode = document.getElementById("productImage");
    if (imageNode) {
      imageNode.src = product.image || "images/menulist_01.png";
      imageNode.alt = product.name || "product";
    }

    var addBtn = document.getElementById("addToCartBtn");
    if (!addBtn) return;
    addBtn.disabled = !product.isAvailable;
    addBtn.addEventListener("click", function () {
      if (!window.OvenCart) return;
      window.OvenCart.addItem({
        id: product.id,
        name: product.name,
        price: product.price
      });
      var msg = document.getElementById("productMessage");
      if (msg) {
        msg.textContent = "Added to cart. You can continue in menu checkout.";
        msg.className = "mt-3 text-success";
      }
    });
  }

  function showNotFound(message) {
    setText("productTitle", "Product not found");
    setText("productCategoryLine", "");
    setText("productName", "Unavailable");
    setText("productDescription", message || "The requested item is not available.");
    setText("productPrice", "");
    setText("productPerson", "");
    setText("productAvailability", "");
    var btn = document.getElementById("addToCartBtn");
    if (btn) btn.style.display = "none";
  }

  function init() {
    var productId = getProductId();
    if (!productId) {
      showNotFound("No product selected.");
      return;
    }

    loadJson("data/menu.json")
      .then(function (data) {
        var product = findProduct(data, productId);
        if (!product) {
          showNotFound("This product does not exist.");
          return;
        }
        renderProduct(product);
      })
      .catch(function () {
        showNotFound("Unable to load product details right now.");
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
