const operationalData = {
  // Coordenadas aproximadas del Puerto de Santa Fe y su entorno operativo.
  // Los puntos son simulados y deben ajustarse con coordenadas oficiales del Puerto.
  mapCenter: [-31.6409, -60.6878],
  zoom: 14,

  zones: [
    {
      id: "gate",
      name: "Gate / ingreso",
      type: "ops",
      coords: [-31.6468, -60.6977],
      description: "Ingreso de camiones, validación de turno y control documental."
    },
    {
      id: "scale",
      name: "Balanza",
      type: "warning",
      coords: [-31.6443, -60.6942],
      description: "Pesaje inicial y final. Punto crítico de espera."
    },
    {
      id: "unload",
      name: "Zona de descarga",
      type: "ops",
      coords: [-31.6417, -60.6902],
      description: "Descarga de cereal / transferencia a acopio."
    },
    {
      id: "storage",
      name: "Acopio / transferencia",
      type: "ops",
      coords: [-31.6435, -60.6884],
      description: "Acopio transitorio y alimentación al muelle."
    },
    {
      id: "dock",
      name: "Muelle operativo",
      type: "ops",
      coords: [-31.6374, -60.6847],
      description: "Carga a barcaza o buque."
    }
  ],

  route: [
    [-31.6468, -60.6977],
    [-31.6443, -60.6942],
    [-31.6417, -60.6902],
    [-31.6435, -60.6884],
    [-31.6374, -60.6847]
  ],

  ships: [
    {
      id: "BAR-01",
      name: "Convoy Soja Norte",
      status: "Carga en curso",
      badge: "ok",
      coords: [-31.6368, -60.6839],
      tonsTotal: 5000,
      tonsLoaded: 3120,
      eta: "18:40"
    },
    {
      id: "BUQ-02",
      name: "Carga General",
      status: "Programado",
      badge: "warn",
      coords: [-31.6338, -60.6815],
      tonsTotal: 2800,
      tonsLoaded: 0,
      eta: "Mañana 07:30"
    }
  ],

  trucks: Array.from({ length: 35 }, (_, index) => {
    const baseLat = -31.6469 + (index % 7) * 0.00045;
    const baseLon = -60.698 + Math.floor(index / 7) * 0.00155;
    const stages = [
      "Ingreso",
      "Control documental",
      "Balanza ingreso",
      "Espera",
      "Descarga",
      "Balanza salida",
      "Salida"
    ];

    return {
      id: `CAM-${1001 + index}`,
      coords: [baseLat, baseLon],
      stage: stages[Math.min(stages.length - 1, Math.floor(index / 5))],
      tons: [28, 29, 30, 31, 32][index % 5],
      wait: 6 + ((index * 7) % 33)
    };
  }),

  scenarios: [
    {
      title: "Actual",
      lines: ["226.388 tn/año", "~30 camiones/día", "45 operaciones fluviales"]
    },
    {
      title: "+2 años",
      lines: ["350.000 tn/año", "~50 camiones/día", "riesgo gate/balanza"]
    },
    {
      title: "+5 años",
      lines: ["600.000 tn/año", "~85 camiones/día", "presión muelles/acopio"]
    },
    {
      title: "+10 años",
      lines: ["1.000.000 tn/año", "~140 camiones/día", "centro operativo integrado"]
    }
  ]
};
