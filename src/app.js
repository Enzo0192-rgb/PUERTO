let map;
let current = "actual";
let layers = [];

function n(x){return x.toLocaleString("es-AR")}
function money(x){return "USD " + Math.round(x).toLocaleString("es-AR")}
function clearLayers(){layers.forEach(l=>map.removeLayer(l)); layers=[];}
function icon(html,size=[28,28],anchor=[14,14]){return L.divIcon({className:"",html,iconSize:size,iconAnchor:anchor});}

function init(){
  map = L.map("map",{zoomControl:true,scrollWheelZoom:true}).setView(mapData.center,mapData.zoom);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri"}).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{opacity:.08,maxZoom:19}).addTo(map);

  document.querySelectorAll(".scenario-tabs button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      current=btn.dataset.scenario;
      document.querySelectorAll(".scenario-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.scenario===current));
      renderAll();
    });
  });
  ["turns","scale","yard","dock"].forEach(id=>document.getElementById(id).addEventListener("change",renderInvestment));
  ["trucksDay","waitMin","truckCost"].forEach(id=>document.getElementById(id).addEventListener("input",calculateCosts));
  document.getElementById("calcBtn").addEventListener("click",calculateCosts);
  renderAll();
}

function renderAll(){
  renderKPIs();
  renderMap();
  renderShips();
  renderInvestment();
  calculateCosts();
  renderAlerts();
}

function renderKPIs(){
  const s=scenarios[current];
  const pTrucks=Math.round(s.trucks/s.cap*100);
  const pTons=Math.round(s.tons/s.tonsCap*100);
  const items=[
    ["Camiones en playa",`${s.trucks} / ${s.cap}`,pTrucks],
    ["Toneladas por cargar",`${n(s.tons)} tn`,pTons],
    ["Buques en río",s.ships,Math.min(100,s.ships*15)],
    ["Tiempo prom. espera",`${s.wait} min`,Math.min(100,s.wait)],
    ["Balanzas operativas","2 / 2",100],
    ["Tolva / descarga",s.unload,Math.min(100,s.unload*3)],
    ["Costo operativo",`$ ${String(s.cost).replace(".",",")} M`,Math.min(100,s.cost*10)],
    ["Escenario",s.label,100]
  ];
  document.getElementById("kpis").innerHTML=items.map(it=>`<div class="kpi"><small>${it[0]}</small><b>${it[1]}</b><div class="bar"><span style="width:${it[2]}%"></span></div></div>`).join("");
  document.getElementById("trucksDay").value=s.trucks;
  document.getElementById("waitMin").value=s.wait;
}

function renderMap(){
  clearLayers();
  mapData.zones.forEach(z=>{
    layers.push(L.polygon(z.polygon,{color:z.color,fillColor:z.color,fillOpacity:.18,weight:2}).addTo(map));
    layers.push(L.polyline([z.label,z.center],{color:z.color,weight:2,opacity:.8}).addTo(map));
    layers.push(L.marker(z.label,{icon:icon(`<div class="zone-label">${z.name}<small>${z.text}</small></div>`,[150,58],[75,29])}).addTo(map));
  });
  layers.push(L.polyline(mapData.routes.in,{color:"#39d86a",weight:3,opacity:.75}).addTo(map));
  layers.push(L.polyline(mapData.routes.op,{color:"#f3cf42",weight:3,opacity:.70}).addTo(map));
  renderTrucks();
  renderShipsOnMap();
}

function renderTrucks(){
  const s=scenarios[current];
  const max=Math.min(s.trucks,120);
  const cols=12;
  for(let i=0;i<max;i++){
    const r=Math.floor(i/cols), c=i%cols;
    const lat=-31.65842-r*0.000095;
    const lon=-60.70618+c*0.000102;
    if(lat>-31.65990 && lon<-60.70496){
      layers.push(L.marker([lat,lon],{icon:icon(`<div class="truck">🚛</div>`,[11,11],[5,5])}).addTo(map));
    }
  }
  [[-31.65792,-60.70672],[-31.66027,-60.70576],[-31.66118,-60.70538],[-31.66185,-60.70455]].forEach(p=>{
    layers.push(L.marker(p,{icon:icon(`<div class="truck-op">🚚</div>`,[16,16],[8,8])}).addTo(map));
  });
}

function renderShipsOnMap(){
  const s=scenarios[current];
  mapData.ships.slice(0,s.ships).forEach(ship=>{
    layers.push(L.marker(ship.pos,{icon:icon(`<div class="ship-icon">🚢</div>`,[42,42],[21,21])}).addTo(map).bindPopup(`${ship.id}<br>Esperando carga<br>${ship.tons}`));
  });
}

function renderShips(){
  const s=scenarios[current];
  document.getElementById("ships").innerHTML=mapData.ships.slice(0,s.ships).map(ship=>`
    <div class="ship"><div class="emoji">🚢</div><div><b>${ship.id}</b><small>${ship.eta}</small></div><div><b>${ship.tons}</b><small>pendientes</small></div></div>
  `).join("");
}

function renderInvestment(){
  let red=0,cap=0,save=0;
  if(turns.checked){red+=18;save+=420000}
  if(scale.checked){red+=22;save+=712000}
  if(yard.checked){cap+=80;red+=10;save+=360000}
  if(dock.checked){red+=8;save+=880000}
  document.getElementById("investmentResult").innerHTML=`
    <div class="row good"><span>Reducción de espera</span><b>-${red}%</b></div>
    <div class="row good"><span>Aumento capacidad</span><b>+${cap} camiones</b></div>
    <div class="row good"><span>Ahorro anual potencial</span><b>${money(save)}</b></div>
  `;
}

function calculateCosts(){
  const daily=Number(trucksDay.value||0)*(Number(waitMin.value||0)/60)*Number(truckCost.value||0);
  document.getElementById("costResult").innerHTML=`
    <div class="row warn"><span>Costo diario por espera</span><b>${money(daily)}</b></div>
    <div class="row warn"><span>Costo anual estimado</span><b>${money(daily*300)}</b></div>
  `;
}

function renderAlerts(){
  const s=scenarios[current];
  const pct=Math.round(s.trucks/s.cap*100);
  document.getElementById("alerts").innerHTML=`
    <div class="alert"><div>⚠️</div><div><b>Ocupación playa ${pct}%</b>Controlar programación de turnos.</div><span>10:22</span></div>
    <div class="alert"><div>🚢</div><div><b>${s.ships} barcazas esperando carga</b>Operación fluvial activa.</div><span>10:18</span></div>
    <div class="alert"><div>✅</div><div><b>Tolva operativa</b>Sin incidencias críticas.</div><span>10:15</span></div>
  `;
}

document.addEventListener("DOMContentLoaded",init);
