window.Simulator = (() => {
  function format(n) {
    return Math.round(n).toLocaleString("es-AR");
  }

  function money(n) {
    return "USD " + format(n);
  }

  function calculateCosts() {
    const trucksDay = Number(document.getElementById("trucksDay").value || 0);
    const waitMin = Number(document.getElementById("waitMin").value || 0);
    const truckHourCost = Number(document.getElementById("truckHourCost").value || 0);
    const daily = trucksDay * (waitMin / 60) * truckHourCost;

    document.getElementById("costResult").innerHTML = `
      <div class="row warn"><span>Costo diario por espera</span><b>${money(daily)}</b></div>
      <div class="row warn"><span>Costo anual estimado</span><b>${money(daily * 300)}</b></div>
    `;
  }

  function renderInvestment() {
    let reduction = 0;
    let capacity = 0;
    let annualSaving = 0;

    if (document.getElementById("invTurns").checked) { reduction += 18; annualSaving += 420000; }
    if (document.getElementById("invScale").checked) { reduction += 22; annualSaving += 712000; }
    if (document.getElementById("invYard").checked) { capacity += 80; reduction += 10; annualSaving += 360000; }
    if (document.getElementById("invDock").checked) { reduction += 8; annualSaving += 880000; }

    document.getElementById("investmentResult").innerHTML = `
      <div class="row good"><span>Reducción de espera</span><b>-${reduction}%</b></div>
      <div class="row good"><span>Aumento capacidad</span><b>+${capacity} camiones</b></div>
      <div class="row good"><span>Ahorro anual potencial</span><b>${money(annualSaving)}</b></div>
    `;
  }

  function syncInputs(scenario) {
    document.getElementById("trucksDay").value = scenario.trucks;
    document.getElementById("waitMin").value = scenario.wait;
  }

  return { calculateCosts, renderInvestment, syncInputs };
})();
