(function () {
  "use strict";

  var CART_KEY = "oven_stories_cart_v1";

  function safeParse(raw) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      return [];
    }
  }

  function read() {
    var raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    var items = safeParse(raw);
    return Array.isArray(items) ? items : [];
  }

  function write(items) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function addItem(item) {
    if (!item || !item.id) return;
    var items = read();
    var existing = items.find(function (entry) {
      return entry.id === item.id;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: item.id,
        name: item.name || "Item",
        price: Number(item.price) || 0,
        qty: 1
      });
    }
    write(items);
  }

  function updateQty(itemId, qty) {
    var items = read().map(function (item) {
      if (item.id === itemId) {
        item.qty = Math.max(1, Number(qty) || 1);
      }
      return item;
    });
    write(items);
  }

  function removeItem(itemId) {
    var items = read().filter(function (item) {
      return item.id !== itemId;
    });
    write(items);
  }

  function clear() {
    window.localStorage.removeItem(CART_KEY);
  }

  function getSubtotal() {
    return read().reduce(function (acc, item) {
      return acc + (Number(item.price) || 0) * (Number(item.qty) || 0);
    }, 0);
  }

  window.OvenCart = {
    key: CART_KEY,
    read: read,
    write: write,
    addItem: addItem,
    updateQty: updateQty,
    removeItem: removeItem,
    clear: clear,
    getSubtotal: getSubtotal
  };
})();
