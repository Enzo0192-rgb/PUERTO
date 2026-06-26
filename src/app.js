let map;
let currentScenario = "actual";
let layers = [];

function clearMapLayers(){ layers.forEach(layer => map.removeLayer(layer)); layers = []; }
function icon(html, size=[28,28], anchor=[14,14]){ return L.divIcon({className:"", html, iconSize:size, iconAnchor:anchor}); }
function money(v){ return "USD " + Math.round(v).toLocaleString("es-AR"); }

function init(){
  map = L.map("map",{zoomControl:true, scrollWheelZoom:true}).setView(mapData.center, mapData.zoom);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {attribution:"Tiles &copy; Esri"}).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {opacity:.08, maxZoom:19}).addTo(map);

  document.querySelectorAll(".scenario-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      currentScenario = btn.dataset.scenario;
      document.querySelectorAll(".scenario-btn").forEach(b=>b.classList.toggle("active", b.dataset.scenario===currentScenario));
      renderAll();
    });
  });
  document.getElementById("simulateBtn").addEventListener("click", renderInvestment);
  renderAll();
}

function renderAll(){
  renderKPIs();
  renderMap();
  renderPanels();
  renderInvestment();
}

function renderKPIs(){
  const s = scenarios[currentScenario];
  const kpis = [
    ["Camiones en playa", `${s.trucksInYard} / ${s.yardCapacity}`, "En espera", ""],
    ["Balanzas operativas", `${s.scales} / 2`, "En uso", ""],
    ["En descarga", s.unloading, "Camiones", ""],
    ["Toneladas hoy", `${s.tonsToday.toLocaleString("es-AR")} tn`, "Total descargado", ""],
    ["Buques en río", s.vessels, "Esperando carga", ""],
    ["Tiempo prom. balanza", `${s.scaleTime} min`, "Por camión", ""],
    ["Tiempo prom. descarga", `${s.dischargeTime} min`, "Por camión", ""],
    ["Costo operativo hoy", money(s.costToday), "Estimado", "orange"]
  ];
  document.getElementById("kpis").innerHTML = kpis.map(k=>`<article class="kpi ${k[3]}"><div class="label">${k[0]}</div><div class="value">${k[1]}</div><div class="note">${k[2]}</div></article>`).join("");
}

function renderMap(){
  clearMapLayers();
  const s = scenarios[currentScenario];

  // Áreas operativas concentradas en la terminal real
  mapData.zones.forEach(z=>{
    layers.push(L.polygon(z.polygon,{color:z.color,fillColor:z.color,fillOpacity:.20,weight:2}).addTo(map));
    layers.push(L.polyline([z.label, z.center],{color:z.color,weight:2,opacity:.85}).addTo(map));
    layers.push(L.marker(z.label,{icon:icon(`<div class="zone-label ${z.cls}"><div class="z-title">${z.name}</div><small>${z.text}</small></div>`,[155,60],[77,30])}).addTo(map));
  });

  // Muelle sin etiqueta grande sobre el río para no invadir el agua
  layers.push(L.polygon(mapData.dock.polygon,{color:"#ff4747",fillColor:"#ff4747",fillOpacity:.17,weight:2}).addTo(map));
  layers.push(L.marker([-31.65975,-60.70285],{icon:icon(`<div class="zone-label orange"><div class="z-title">Muelle</div><small>Barcazas esperando carga</small></div>`,[165,60],[82,30])}).addTo(map));

  // Rutas sin línea de puntos: trazos suaves y sólidos
  layers.push(L.polyline(mapData.routes.in,{color:"#4fc368",weight:3,opacity:.75}).addTo(map));
  layers.push(L.polyline(mapData.routes.op,{color:"#f3cf42",weight:3,opacity:.70}).addTo(map));
  layers.push(L.polyline(mapData.routes.out,{color:"#2381d9",weight:3,opacity:.70}).addTo(map));

  renderTruckYard(s);
  renderOperationalTrucks();
  renderShips(s);
}

function renderTruckYard(s){
  const maxVisible = Math.min(s.trucksInYard, 120);
  const cols = 12;
  for(let i=0;i<maxVisible;i++){
    const r = Math.floor(i/cols);
    const c = i%cols;
    const lat = -31.65842 - r*0.000095;
    const lon = -60.70618 + c*0.000102;
    if(lat > -31.65992 && lon < -60.70496){
      layers.push(L.marker([lat,lon],{icon:icon(`<div class="truck-icon">🚛</div>`,[11,11],[5,5])}).addTo(map));
    }
  }
}

function renderOperationalTrucks(){
  const trucks = [
    [-31.65792,-60.70672,"Gate"],
    [-31.66027,-60.70576,"Balanza"],
    [-31.66118,-60.70538,"Tolva"],
    [-31.66185,-60.70455,"Silos"],
    [-31.65755,-60.70785,"Egreso"]
  ];
  trucks.forEach(t=>{
    layers.push(L.marker([t[0],t[1]],{icon:icon(`<div class="truck-op">🚚</div>`,[16,16],[8,8])}).addTo(map).bindPopup(`Camión en proceso: ${t[2]}`));
  });
}

function renderShips(s){
  mapData.ships.slice(0,s.shipsVisible).forEach((ship,i)=>{
    layers.push(L.marker(ship.pos,{icon:icon(`<div class="ship-icon">🚢</div>`,[38,38],[19,19])}).addTo(map).bindPopup(`${ship.id}<br>${ship.state}<br>${ship.cargo}`));
  });
}

function renderPanels(){
  const s = scenarios[currentScenario];

  document.getElementById("riverOps").innerHTML = mapData.ships.slice(0, Math.min(2,s.shipsVisible)).map(ship=>{
    const pct = ship.loaded ? Math.round(ship.loaded/ship.total*100) : 0;
    return `<div class="river-card">
      <div class="ship-emoji">🚢</div>
      <div>
        <b>${ship.id}</b>
        <div class="state">${ship.state}</div>
        <small>${ship.cargo} · ${ship.loaded.toLocaleString("es-AR")} / ${ship.total.toLocaleString("es-AR")} tn</small>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <small>${ship.eta} · ${pct}%</small>
      </div>
    </div>`;
  }).join("");

  const waitingCost = Math.round(s.trucksInYard * s.scaleTime / 60 * 42);
  const dischargeCost = Math.round(s.unloading * s.dischargeTime / 60 * 95);
  const infraCost = Math.max(0, Math.round(s.costToday - waitingCost - dischargeCost));

  document.getElementById("costTable").innerHTML = `
    <tr><td>Espera camiones</td><td>${money(waitingCost)}</td></tr>
    <tr><td>Operación de descarga</td><td>${money(dischargeCost)}</td></tr>
    <tr><td>Infraestructura</td><td>${money(infraCost)}</td></tr>
    <tr><td><b>Total estimado</b></td><td><b style="color:#ff8a22">${money(s.costToday)}</b></td></tr>
  `;

  document.getElementById("donutValue").innerHTML = `${s.tonsToday.toLocaleString("es-AR")}<br><small>tn hoy</small>`;

  document.getElementById("alerts").innerHTML = `
    <div class="alert"><div class="icon">⚠️</div><div><b>Alta ocupación en playa (${Math.round(s.trucksInYard/s.yardCapacity*100)}%)</b>Capacidad recomendada: hasta 80%</div><span>10:22</span></div>
    <div class="alert"><div class="icon">✅</div><div><b>Descarga en tolva T1 completada</b>Camión #AAX-482 finalizó descarga</div><span>10:18</span></div>
    <div class="alert"><div class="icon">ℹ️</div><div><b>Barcazas esperando carga</b>Próximo inicio: 11:30 hs</div><span>10:15</span></div>
  `;
}

function renderInvestment(){
  const option = document.getElementById("investmentSelect").value;
  const impacts = {
    scale:["Tiempo prom. en balanza","-22%","Tiempo prom. de espera","-18 min","Costo operativo anual","-USD 712.000"],
    turns:["Tiempo prom. de espera","-26%","Ocupación playa","-19%","Costo operativo anual","-USD 540.000"],
    yard:["Capacidad playa","+80 camiones","Saturación","-31%","Costo operativo anual","-USD 420.000"],
    dock:["Productividad de carga","+18%","Espera de barcazas","-24%","Costo operativo anual","-USD 880.000"]
  };
  const i = impacts[option];
  document.getElementById("impactBox").innerHTML = `
    <div class="impact-row"><span>${i[0]}</span><b>${i[1]}</b></div>
    <div class="impact-row"><span>${i[2]}</span><b>${i[3]}</b></div>
    <div class="impact-row"><span>${i[4]}</span><b>${i[5]}</b></div>
  `;
}

document.addEventListener("DOMContentLoaded", init);
