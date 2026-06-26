let currentScenario = "actual";

function getScenario() {
  return SCENARIOS[currentScenario];
}

function render() {
  const scenario = getScenario();
  Charts.renderKPIs(scenario);
  Charts.renderShips(scenario);
  Charts.renderAlerts(scenario);
  Simulator.syncInputs(scenario);
  Simulator.calculateCosts();
  Simulator.renderInvestment();
  PortMap.render(scenario);
}

function bindEvents() {
  document.querySelectorAll("#scenarioNav button").forEach(button => {
    button.addEventListener("click", () => {
      currentScenario = button.dataset.scenario;
      document.querySelectorAll("#scenarioNav button").forEach(b => b.classList.toggle("active", b.dataset.scenario === currentScenario));
      render();
    });
  });

  document.querySelectorAll("[data-layer]").forEach(input => {
    input.addEventListener("change", () => {
      PortMap.setLayerVisible(input.dataset.layer, input.checked);
    });
  });

  ["invTurns", "invScale", "invYard", "invDock"].forEach(id => {
    document.getElementById(id).addEventListener("change", Simulator.renderInvestment);
  });

  ["trucksDay", "waitMin", "truckHourCost"].forEach(id => {
    document.getElementById(id).addEventListener("input", Simulator.calculateCosts);
  });

  document.getElementById("calcBtn").addEventListener("click", Simulator.calculateCosts);
}

document.addEventListener("DOMContentLoaded", () => {
  PortMap.init();
  bindEvents();
  render();
});
