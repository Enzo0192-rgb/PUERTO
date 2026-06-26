window.PortMap = (() => {
  let map;
  let layerGroups = {
    zones: [],
    routes: [],
    trucks: [],
    ships: []
  };

  function icon(html, size = [28,28], anchor = [14,14]) {
    return L.divIcon({ className: "", html, iconSize: size, iconAnchor: anchor });
  }

  function clearGroup(name) {
    layerGroups[name].forEach(layer => map.removeLayer(layer));
    layerGroups[name] = [];
  }

  function clearAll() {
    Object.keys(layerGroups).forEach(clearGroup);
  }

  function addToGroup(group, layer) {
    layerGroups[group].push(layer.addTo(map));
  }

  function init() {
    map = L.map("map", { zoomControl: true, scrollWheelZoom: true })
      .setView(PORT_MAP.center, PORT_MAP.zoom);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri"
    }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      opacity: 0.08,
      maxZoom: 19
    }).addTo(map);

    return map;
  }

  function renderZones() {
    clearGroup("zones");
    PORT_MAP.zones.forEach(z => {
      addToGroup("zones", L.polygon(z.polygon, { color: z.color, fillColor: z.color, fillOpacity: .18, weight: 2 }));
      addToGroup("zones", L.polyline([z.label, z.center], { color: z.color, weight: 2, opacity: .8 }));
      addToGroup("zones", L.marker(z.label, {
        icon: icon(`<div class="zone-label">${z.name}<small>${z.text}</small></div>`, [150,58], [75,29])
      }));
    });
  }

  function renderRoutes() {
    clearGroup("routes");
    addToGroup("routes", L.polyline(PORT_MAP.routes.in, { color: "#39d86a", weight: 3, opacity: .75 }));
    addToGroup("routes", L.polyline(PORT_MAP.routes.op, { color: "#f3cf42", weight: 3, opacity: .70 }));
  }

  function renderTrucks(scenario) {
    clearGroup("trucks");

    const max = Math.min(scenario.trucks, 120);
    const cols = 12;

    for (let i=0; i<max; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const lat = -31.65842 - r * 0.000095;
      const lon = -60.70618 + c * 0.000102;

      if (lat > -31.65990 && lon < -60.70496) {
        addToGroup("trucks", L.marker([lat, lon], {
          icon: icon(`<div class="truck">🚛</div>`, [11,11], [5,5])
        }));
      }
    }

    [[-31.65792,-60.70672],[-31.66027,-60.70576],[-31.66118,-60.70538],[-31.66185,-60.70455]].forEach(p => {
      addToGroup("trucks", L.marker(p, {
        icon: icon(`<div class="truck-op">🚚</div>`, [16,16], [8,8])
      }));
    });
  }

  function renderShips(scenario) {
    clearGroup("ships");
    PORT_MAP.ships.slice(0, scenario.ships).forEach(ship => {
      addToGroup("ships", L.marker(ship.pos, {
        icon: icon(`<div class="ship-icon">🚢</div>`, [42,42], [21,21])
      }).bindPopup(`${ship.id}<br>Esperando carga<br>${ship.tons}`));
    });
  }

  function setLayerVisible(group, visible) {
    layerGroups[group].forEach(layer => {
      if (visible) {
        layer.addTo(map);
      } else {
        map.removeLayer(layer);
      }
    });
  }

  function render(scenario) {
    renderZones();
    renderRoutes();
    renderTrucks(scenario);
    renderShips(scenario);
  }

  return { init, render, setLayerVisible };
})();
