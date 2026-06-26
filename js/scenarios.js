window.SCENARIOS = {
  actual: {
    label: "Hoy",
    trucks: 118,
    truckCapacity: 160,
    tons: 24350,
    tonsCapacity: 30000,
    wait: 36,
    cost: 2.45,
    ships: 2,
    scaleTime: 12,
    unload: 12
  },
  y2: {
    label: "+2 años",
    trucks: 154,
    truckCapacity: 190,
    tons: 35000,
    tonsCapacity: 45000,
    wait: 49,
    cost: 3.1,
    ships: 3,
    scaleTime: 17,
    unload: 18
  },
  y5: {
    label: "+5 años",
    trucks: 238,
    truckCapacity: 260,
    tons: 62000,
    tonsCapacity: 80000,
    wait: 72,
    cost: 5.8,
    ships: 5,
    scaleTime: 26,
    unload: 26
  },
  y10: {
    label: "+10 años",
    trucks: 390,
    truckCapacity: 420,
    tons: 110000,
    tonsCapacity: 140000,
    wait: 105,
    cost: 9.7,
    ships: 6,
    scaleTime: 41,
    unload: 42
  }
};

window.PORT_MAP = {
  center: [-31.65915, -60.70420],
  zoom: 18,
  zones: [
    {
      name: "Acceso / Gate",
      text: "Ingreso camiones",
      color: "#39d86a",
      center: [-31.65792, -60.70672],
      label: [-31.65775, -60.70755],
      polygon: [[-31.65772,-60.70698],[-31.65758,-60.70652],[-31.65812,-60.70636],[-31.65824,-60.70682]]
    },
    {
      name: "Playa de espera",
      text: "Camiones en cola",
      color: "#f3cf42",
      center: [-31.65905, -60.70565],
      label: [-31.65898, -60.70712],
      polygon: [[-31.65822,-60.70626],[-31.65825,-60.70500],[-31.65988,-60.70496],[-31.65990,-60.70622]]
    },
    {
      name: "Balanzas",
      text: "2 operativas",
      color: "#2381d9",
      center: [-31.66027, -60.70576],
      label: [-31.66022, -60.70724],
      polygon: [[-31.66002,-60.70616],[-31.66002,-60.70535],[-31.66070,-60.70534],[-31.66070,-60.70610]]
    },
    {
      name: "Tolva / Descarga",
      text: "Descarga terrestre",
      color: "#ff8a22",
      center: [-31.66118, -60.70538],
      label: [-31.66112, -60.70722],
      polygon: [[-31.66085,-60.70580],[-31.66082,-60.70486],[-31.66158,-60.70483],[-31.66162,-60.70574]]
    },
    {
      name: "Silos",
      text: "Acopio",
      color: "#a276ff",
      center: [-31.66185, -60.70455],
      label: [-31.66182, -60.70670],
      polygon: [[-31.66128,-60.70502],[-31.66125,-60.70420],[-31.66230,-60.70415],[-31.66236,-60.70495]]
    }
  ],
  routes: {
    in: [[-31.65725,-60.70760],[-31.65792,-60.70672],[-31.65905,-60.70565]],
    op: [[-31.65905,-60.70565],[-31.66027,-60.70576],[-31.66118,-60.70538],[-31.66185,-60.70455]]
  },
  ships: [
    {id:"BZA 1048", tons:"8.000 tn", eta:"ETA 2,4 h", pos:[-31.65872,-60.70115]},
    {id:"BZA 2056", tons:"7.500 tn", eta:"ETA 5,1 h", pos:[-31.66065,-60.70105]},
    {id:"BZA 3091", tons:"8.850 tn", eta:"ETA 7,3 h", pos:[-31.65745,-60.70125]},
    {id:"BZA 4022", tons:"6.200 tn", eta:"ETA 9,1 h", pos:[-31.66175,-60.70095]},
    {id:"BZA 5067", tons:"7.900 tn", eta:"ETA 11,3 h", pos:[-31.65625,-60.70140]},
    {id:"BZA 6020", tons:"8.300 tn", eta:"ETA 13,0 h", pos:[-31.66282,-60.70082]}
  ]
};
