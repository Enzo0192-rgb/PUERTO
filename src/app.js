let map;
let currentScenario = "actual";
let layers = [];

function clearMapLayers() {
  layers.forEach(layer => map.removeLayer(layer));
  layers = [];
}

function icon(html, size = [28, 28], anchor = [14, 14]) {
  return L.divIcon({ className: "", html, iconSize: size, iconAnchor: anchor });
}

function money(value) {
  return "USD " + Math.round(value).toLocaleString("es-AR");
}

function init() {
  map = L.map("map", { zoomControl: true, scrollWheelZoom: true })
    .setView(mapData.center, mapData.zoom);

  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri"
  }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    opacity: 0.12,
    maxZoom: 19
  }).addTo(map);

  document.querySelectorAll(".scenario-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentScenario = btn.dataset.scenario;
      document.querySelectorAll(".scenario-btn").forEach(b => b.classList.toggle("active", b.dataset.scenario === currentScenario));
      renderAll();
    });
  });

  document.getElementById("simulateBtn").addEventListener("click", renderInvestment);
  renderAll();
}

function renderAll() {
  renderKPIs();
  renderMap();
  renderPanels();
  renderInvestment();
}

function renderKPIs() {
  const s = scenarios[currentScenario];
  const kpis = [
    ["Operación activa", s.operation, "", "green"],
    ["Camiones en playa", `${s.trucksInYard} / ${s.yardCapacity}`, "En espera", ""],
    ["En descarga", s.unloading, "Hoy", ""],
    ["Toneladas hoy", `${s.tonsToday.toLocaleString("es-AR")} tn`, "Total descargado", ""],
    ["Buques en río", s.vessels, "En operación", ""],
    ["Productividad", `${s.productivity} tn/h`, "Promedio", ""],
    ["Tiempo prom. espera", `${s.avgWait} min`, "En playa", ""],
    ["Costo operativo hoy", money(s.costToday), "Estimado", "orange"]
  ];

  document.getElementById("kpis").innerHTML = kpis.map(k => `
    <article class="kpi ${k[3]}">
      <div class="label">${k[0]}</div>
      <div class="value">${k[1]}</div>
      <div class="note">${k[2]}</div>
    </article>
  `).join("");
}

function renderMap() {
  clearMapLayers();
  const s = scenarios[currentScenario];

  mapData.zones.forEach(z => {
    layers.push(L.polygon(z.polygon, {
      color: z.color,
      fillColor: z.color,
      fillOpacity: 0.23,
      weight: 2
    }).addTo(map));

    layers.push(L.marker(z.center, {
      icon: icon(`<div class="zone-label">${z.name}<small>${z.text}</small></div>`, [140, 52], [70, 26])
    }).addTo(map));
  });

  layers.push(L.polyline(mapData.routes.in, { color: "#4fc368", weight: 4, dashArray: "8 8" }).addTo(map));
  layers.push(L.polyline(mapData.routes.op, { color: "#f3cf42", weight: 4, dashArray: "8 8" }).addTo(map));
  layers.push(L.polyline(mapData.routes.out, { color: "#2381d9", weight: 4, dashArray: "8 8" }).addTo(map));

  renderTruckYard(s);
  renderOperationalTrucks();
  renderShips(s);

  layers.push(L.polyline([
    [-31.65540, -60.70095],
    [-31.66440, -60.69950]
  ], { color: "#2381d9", weight: 3, dashArray: "12 10" }).addTo(map));
}

function renderTruckYard(s) {
  const maxVisible = Math.min(s.trucksInYard, 130);
  const cols = 13;
  for (let i = 0; i < maxVisible; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const lat = -31.65848 - r * 0.000105;
    const lon = -60.70718 + c * 0.000125;

    if (lat > -31.66008 && lon < -60.70562) {
      layers.push(L.marker([lat, lon], {
        icon: icon(`<div class="truck-icon">🚛</div>`, [14, 14], [7, 7])
      }).addTo(map).bindPopup(`Camión en playa<br>Espera promedio: ${s.avgWait} min`));
    }
  }
}

function renderOperationalTrucks() {
  const trucks = [
    [-31.65780, -60.70755, "Ingreso / Gate"],
    [-31.66055, -60.70668, "Balanza"],
    [-31.66160, -60.70605, "Descarga"],
    [-31.66172, -60.70472, "Silos / acopio"],
    [-31.65640, -60.70895, "Egreso"]
  ];

  trucks.forEach(t => {
    layers.push(L.marker([t[0], t[1]], {
      icon: icon(`<div class="truck-op">🚚</div>`, [18, 18], [9, 9])
    }).addTo(map).bindPopup(`Camión en proceso<br>${t[2]}`));
  });
}

function renderShips(s) {
  mapData.ships.slice(0, s.shipsVisible || s.vessels).forEach((ship, i) => {
    const p = mapData.shipPositions[i];
    layers.push(L.marker(p, {
      icon: icon(`<div class="ship-icon">🚢</div>`, [36, 36], [18, 18])
    }).addTo(map).bindPopup(`${ship.id}<br>${ship.state}<br>${ship.loaded} / ${ship.total} tn`));

    if (i < 2) {
      layers.push(L.marker([p[0] + 0.00035, p[1] + 0.00055], {
        icon: icon(`
          <div class="ship-label">
            <b>${ship.id}</b><br>
            ${ship.state}<br>
            ${ship.cargo}<br>
            ${ship.loaded.toLocaleString("es-AR")} / ${ship.total.toLocaleString("es-AR")} tn<br>
            ETA: ${ship.eta}
          </div>
        `, [150, 96], [0, 48])
      }).addTo(map));
    }
  });
}

function renderPanels() {
  const s = scenarios[currentScenario];

  document.getElementById("summaryTable").innerHTML = `
    <tr><td>Camiones ingresados hoy</td><td>${s.trucksIn}</td></tr>
    <tr><td>Camiones descargados hoy</td><td>${s.trucksUnloaded}</td></tr>
    <tr><td>Toneladas descargadas hoy</td><td>${s.tonsToday.toLocaleString("es-AR")} tn</td></tr>
    <tr><td>Buques en operación</td><td>${s.vessels}</td></tr>
    <tr><td>Tiempo prom. en balanza</td><td>${s.scaleTime} min</td></tr>
    <tr><td>Tiempo prom. en descarga</td><td>${s.dischargeTime} min</td></tr>
  `;

  document.getElementById("shipsTable").innerHTML = mapData.ships.slice(0, Math.min(2, s.vessels)).map(ship => {
    const pct = Math.round(ship.loaded / ship.total * 100);
    return `
      <tr>
        <td>${ship.id}</td>
        <td><span class="badge ${ship.ok ? "ok" : "warn"}">${ship.state}</span></td>
        <td><span class="progress"><span style="width:${pct}%"></span></span>${pct}%</td>
        <td>${ship.eta}</td>
      </tr>
    `;
  }).join("");

  const waitingCost = Math.round(s.trucksInYard * s.avgWait / 60 * 42);
  const dischargeCost = Math.round(s.unloading * s.dischargeTime / 60 * 95);
  const infraCost = Math.round(s.costToday - waitingCost - dischargeCost);

  document.getElementById("costTable").innerHTML = `
    <tr><td>Espera camiones</td><td>${money(waitingCost)}</td></tr>
    <tr><td>Operación de descarga</td><td>${money(dischargeCost)}</td></tr>
    <tr><td>Infraestructura</td><td>${money(infraCost)}</td></tr>
    <tr><td><b>Total estimado</b></td><td><b style="color:#ff8a22">${money(s.costToday)}</b></td></tr>
  `;

  document.getElementById("donutValue").innerHTML = `${s.tonsToday.toLocaleString("es-AR")}<br><small>tn hoy</small>`;

  document.getElementById("alerts").innerHTML = `
    <div class="alert"><div class="icon">⚠️</div><div><b>Alta ocupación en playa (${Math.round(s.trucksInYard / s.yardCapacity * 100)}%)</b>Capacidad recomendada: hasta 80%</div><span>10:22</span></div>
    <div class="alert"><div class="icon">✅</div><div><b>Descarga en tolva T1 completa</b>Camión #AAX-482 finalizó descarga</div><span>10:18</span></div>
    <div class="alert"><div class="icon">ℹ️</div><div><b>Próximo buque en espera</b>ETA: 11:30 hs</div><span>10:15</span></div>
  `;
}

function renderInvestment() {
  const option = document.getElementById("investmentSelect").value;
  const impacts = {
    scale: ["Tiempo prom. en balanza", "-22%", "Tiempo prom. de espera", "-18 min", "Costo operativo anual", "-USD 712.000"],
    turns: ["Tiempo prom. de espera", "-26%", "Ocupación playa", "-19%", "Costo operativo anual", "-USD 540.000"],
    yard: ["Capacidad playa", "+80 camiones", "Saturación", "-31%", "Costo operativo anual", "-USD 420.000"],
    dock: ["Productividad de muelle", "+18%", "Demora fluvial", "-24%", "Costo operativo anual", "-USD 880.000"]
  };
  const i = impacts[option];
  document.getElementById("impactBox").innerHTML = `
    <div class="impact-row"><span>${i[0]}</span><b>${i[1]}</b></div>
    <div class="impact-row"><span>${i[2]}</span><b>${i[3]}</b></div>
    <div class="impact-row"><span>${i[4]}</span><b>${i[5]}</b></div>
  `;
}

document.addEventListener("DOMContentLoaded", init);
