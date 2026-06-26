window.Charts = (() => {
  function renderKPIs(scenario) {
    const pctTrucks = Math.round(scenario.trucks / scenario.truckCapacity * 100);
    const pctTons = Math.round(scenario.tons / scenario.tonsCapacity * 100);

    const items = [
      ["Camiones en playa", `${scenario.trucks} / ${scenario.truckCapacity}`, pctTrucks],
      ["Toneladas por cargar", `${scenario.tons.toLocaleString("es-AR")} tn`, pctTons],
      ["Buques en río", scenario.ships, Math.min(100, scenario.ships * 15)],
      ["Tiempo prom. espera", `${scenario.wait} min`, Math.min(100, scenario.wait)],
      ["Balanzas operativas", "2 / 2", 100],
      ["Tolva / descarga", scenario.unload, Math.min(100, scenario.unload * 3)],
      ["Costo operativo", `$ ${String(scenario.cost).replace(".", ",")} M`, Math.min(100, scenario.cost * 10)],
      ["Escenario", scenario.label, 100]
    ];

    document.getElementById("kpiStrip").innerHTML = items.map(item => `
      <article class="kpi">
        <small>${item[0]}</small>
        <b>${item[1]}</b>
        <div class="bar"><span style="width:${item[2]}%"></span></div>
      </article>
    `).join("");
  }

  function renderShips(scenario) {
    document.getElementById("shipsList").innerHTML = PORT_MAP.ships.slice(0, scenario.ships).map(ship => `
      <div class="ship-card">
        <div class="emoji">🚢</div>
        <div><b>${ship.id}</b><small>${ship.eta}</small></div>
        <div><b>${ship.tons}</b><small>pendientes</small></div>
      </div>
    `).join("");
  }

  function renderAlerts(scenario) {
    const pct = Math.round(scenario.trucks / scenario.truckCapacity * 100);
    document.getElementById("alerts").innerHTML = `
      <div class="alert"><div>⚠️</div><div><b>Ocupación playa ${pct}%</b>Controlar programación de turnos.</div><span>10:22</span></div>
      <div class="alert"><div>🚢</div><div><b>${scenario.ships} barcazas esperando carga</b>Operación fluvial activa.</div><span>10:18</span></div>
      <div class="alert"><div>✅</div><div><b>Tolva operativa</b>Sin incidencias críticas.</div><span>10:15</span></div>
    `;
  }

  return { renderKPIs, renderShips, renderAlerts };
})();
