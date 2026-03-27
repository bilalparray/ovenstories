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
            if (
              (xhr.status >= 200 && xhr.status < 300) ||
              (xhr.status === 0 && xhr.responseText)
            ) {
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

  function createGalleryItem(item) {
    var col = document.createElement("div");
    col.className = "col-md-4 col-sm-6 col-xs-12";
    var image = item.thumb || item.image || "";
    var full = item.image || item.thumb || "";
    var alt = item.alt || item.title || "gallery image";

    var wrap = document.createElement("div");
    wrap.className = "img";

    var img = document.createElement("img");
    img.className = "img-fluid";
    img.src = image;
    img.alt = alt;

    var anchor = document.createElement("a");
    anchor.href = full;
    anchor.setAttribute("data-lightbox", "example-set");
    anchor.setAttribute("data-title", item.title || "");

    var icon = document.createElement("i");
    icon.className = "icofont-ui-zoom-in";

    anchor.appendChild(icon);
    wrap.appendChild(img);
    wrap.appendChild(anchor);
    col.appendChild(wrap);

    return col;
  }

  function renderGallery(data) {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    var items = (data && data.items ? data.items : []).filter(function (item) {
      return item && item.isActive !== false && (item.image || item.thumb);
    });

    if (!items.length) {
      grid.innerHTML =
        '<div class="col-12 text-center"><p>No gallery images available right now.</p></div>';
      return;
    }

    items.forEach(function (item) {
      grid.appendChild(createGalleryItem(item));
    });
  }

  function init() {
    if (!document.getElementById("galleryGrid")) return;
    loadJson("data/gallery.json")
      .then(renderGallery)
      .catch(function () {
        var grid = document.getElementById("galleryGrid");
        if (grid) {
          grid.innerHTML =
            '<div class="col-12 text-center"><p>Unable to load gallery right now.</p></div>';
        }
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
