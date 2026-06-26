function createMarkerIcon(className, size = 16) {
  return L.divIcon({
    className: "",
    html: `<div class="custom-marker ${className}" style="width:${size}px;height:${size}px"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function initMap() {
  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView(operationalData.mapCenter, operationalData.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.polyline(operationalData.route, {
    color: "#1B3558",
    weight: 5,
    opacity: 0.75,
    dashArray: "8 10"
  }).addTo(map).bindPopup("Secuencia operativa simulada: ingreso → balanza → descarga → acopio → muelle.");

  operationalData.zones.forEach((zone) => {
    const iconClass = zone.type === "warning" ? "warning-marker" : "ops-marker";
    L.marker(zone.coords, { icon: createMarkerIcon(iconClass, 18) })
      .addTo(map)
      .bindPopup(`<strong>${zone.name}</strong><br>${zone.description}`);
  });

  operationalData.ships.forEach((ship) => {
    const progress = ship.tonsTotal > 0 ? Math.round((ship.tonsLoaded / ship.tonsTotal) * 100) : 0;

    L.marker(ship.coords, { icon: createMarkerIcon("ship-marker", 22) })
      .addTo(map)
      .bindPopup(`
        <strong>${ship.id} · ${ship.name}</strong><br>
        Estado: ${ship.status}<br>
        Avance: ${ship.tonsLoaded.toLocaleString("es-AR")} / ${ship.tonsTotal.toLocaleString("es-AR")} tn (${progress}%)<br>
        ETA/ETD: ${ship.eta}
      `);
  });

  operationalData.trucks.forEach((truck) => {
    L.marker(truck.coords, { icon: createMarkerIcon("truck-marker", 10) })
      .addTo(map)
      .bindPopup(`
        <strong>${truck.id}</strong><br>
        Etapa: ${truck.stage}<br>
        Carga: ${truck.tons} tn<br>
        Espera: ${truck.wait} min
      `);
  });
}

function renderShipsTable() {
  const tbody = document.getElementById("ships-table");

  tbody.innerHTML = operationalData.ships
    .map((ship) => {
      const progress = `${ship.tonsLoaded.toLocaleString("es-AR")} / ${ship.tonsTotal.toLocaleString("es-AR")} tn`;
      return `
        <tr>
          <td>${ship.id}</td>
          <td><span class="badge ${ship.badge}">${ship.status}</span></td>
          <td>${progress}</td>
          <td>${ship.eta}</td>
        </tr>
      `;
    })
    .join("");
}

function renderScenarios() {
  const container = document.getElementById("scenarios");

  container.innerHTML = operationalData.scenarios
    .map((scenario) => {
      return `
        <article class="scenario">
          <h3>${scenario.title}</h3>
          <div>${scenario.lines.join("<br>")}</div>
        </article>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  renderShipsTable();
  renderScenarios();
});
