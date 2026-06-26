const scenarios = {
  actual: {
    label: "Hoy",
    operation: "Soja",
    trucksInYard: 118,
    yardCapacity: 160,
    unloading: 12,
    tonsToday: 3450,
    vessels: 2,
    productivity: 152,
    avgWait: 48,
    costToday: 24860,
    trucksIn: 184,
    trucksUnloaded: 66,
    scaleTime: 12,
    dischargeTime: 36,
    shipsVisible: 2
  },
  y2: {
    label: "+2 años",
    operation: "Soja",
    trucksInYard: 154,
    yardCapacity: 190,
    unloading: 18,
    tonsToday: 5200,
    vessels: 3,
    productivity: 181,
    avgWait: 61,
    costToday: 39500,
    trucksIn: 265,
    trucksUnloaded: 102,
    scaleTime: 17,
    dischargeTime: 40,
    shipsVisible: 3
  },
  y5: {
    label: "+5 años",
    operation: "Soja",
    trucksInYard: 238,
    yardCapacity: 260,
    unloading: 26,
    tonsToday: 8300,
    vessels: 5,
    productivity: 230,
    avgWait: 82,
    costToday: 72000,
    trucksIn: 410,
    trucksUnloaded: 178,
    scaleTime: 26,
    dischargeTime: 45,
    shipsVisible: 5
  },
  y10: {
    label: "+10 años",
    operation: "Soja",
    trucksInYard: 390,
    yardCapacity: 420,
    unloading: 42,
    tonsToday: 14200,
    vessels: 8,
    productivity: 310,
    avgWait: 110,
    costToday: 148000,
    trucksIn: 720,
    trucksUnloaded: 310,
    scaleTime: 41,
    dischargeTime: 54,
    shipsVisible: 8
  }
};

const mapData = {
  center: [-31.659167651723646, -60.70550131759913],
  zoom: 17,
  zones: [
    {
      name: "Acceso / Gate",
      text: "Ingreso camiones",
      color: "#4fc368",
      center: [-31.65780, -60.70755],
      polygon: [
        [-31.65745, -60.70820],
        [-31.65728, -60.70738],
        [-31.65805, -60.70710],
        [-31.65820, -60.70798]
      ]
    },
    {
      name: "Playa de espera",
      text: "118 camiones",
      color: "#f3cf42",
      center: [-31.65905, -60.70655],
      polygon: [
        [-31.65825, -60.70745],
        [-31.65820, -60.70568],
        [-31.65992, -60.70562],
        [-31.66008, -60.70738]
      ]
    },
    {
      name: "Balanza",
      text: "2 operativas",
      color: "#2381d9",
      center: [-31.66055, -60.70668],
      polygon: [
        [-31.66020, -60.70710],
        [-31.66012, -60.70624],
        [-31.66095, -60.70618],
        [-31.66102, -60.70702]
      ]
    },
    {
      name: "Tolva / Descarga",
      text: "12 camiones",
      color: "#ff8a22",
      center: [-31.66160, -60.70605],
      polygon: [
        [-31.66110, -60.70670],
        [-31.66102, -60.70528],
        [-31.66208, -60.70518],
        [-31.66218, -60.70655]
      ]
    },
    {
      name: "Silos",
      text: "Cap. 120.000 tn",
      color: "#a276ff",
      center: [-31.66172, -60.70472],
      polygon: [
        [-31.66075, -60.70520],
        [-31.66070, -60.70405],
        [-31.66260, -60.70395],
        [-31.66265, -60.70508]
      ]
    },
    {
      name: "Muelle 1",
      text: "Carga fluvial",
      color: "#ff4747",
      center: [-31.66010, -60.70295],
      polygon: [
        [-31.65915, -60.70355],
        [-31.65905, -60.70235],
        [-31.66095, -60.70220],
        [-31.66102, -60.70335]
      ]
    }
  ],
  routes: {
    in: [
      [-31.65600, -60.70880],
      [-31.65780, -60.70755],
      [-31.65905, -60.70655]
    ],
    op: [
      [-31.65905, -60.70655],
      [-31.66055, -60.70668],
      [-31.66160, -60.70605],
      [-31.66172, -60.70472],
      [-31.66010, -60.70295]
    ],
    out: [
      [-31.66160, -60.70605],
      [-31.66055, -60.70668],
      [-31.65820, -60.70820],
      [-31.65640, -60.70895]
    ]
  },
  shipPositions: [
    [-31.65795, -60.70050],
    [-31.66055, -60.70015],
    [-31.65685, -60.70075],
    [-31.66165, -60.69995],
    [-31.65580, -60.70095],
    [-31.66280, -60.69975],
    [-31.65470, -60.70115],
    [-31.66390, -60.69955]
  ],
  ships: [
    { id:"BARCAZA 01", state:"En descarga", cargo:"Soja", loaded:1950, total:3000, eta:"13:45", ok:true },
    { id:"BARCAZA 02", state:"En espera", cargo:"Soja", loaded:0, total:3000, eta:"11:30", ok:false },
    { id:"BARCAZA 03", state:"Programada", cargo:"Granel", loaded:0, total:4200, eta:"15:10", ok:false },
    { id:"BARCAZA 04", state:"En maniobra", cargo:"Soja", loaded:500, total:3800, eta:"17:20", ok:false },
    { id:"BARCAZA 05", state:"En espera", cargo:"Carga general", loaded:0, total:2600, eta:"Mañana", ok:false },
    { id:"BARCAZA 06", state:"Programada", cargo:"Soja", loaded:0, total:3000, eta:"Mañana", ok:false },
    { id:"BARCAZA 07", state:"ETA", cargo:"Granel", loaded:0, total:4100, eta:"Mañana", ok:false },
    { id:"BARCAZA 08", state:"ETA", cargo:"Soja", loaded:0, total:3000, eta:"Mañana", ok:false }
  ]
};
