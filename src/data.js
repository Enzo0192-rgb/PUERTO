const scenarios = {
  actual: {label:"Hoy", trucksInYard:118, yardCapacity:160, scales:2, unloading:12, tonsToday:3450, vessels:2, scaleTime:12, dischargeTime:36, costToday:24860, shipsVisible:2},
  y2: {label:"+2 años", trucksInYard:154, yardCapacity:190, scales:2, unloading:18, tonsToday:5200, vessels:3, scaleTime:17, dischargeTime:40, costToday:39500, shipsVisible:3},
  y5: {label:"+5 años", trucksInYard:238, yardCapacity:260, scales:2, unloading:26, tonsToday:8300, vessels:5, scaleTime:26, dischargeTime:45, costToday:72000, shipsVisible:5},
  y10:{label:"+10 años", trucksInYard:390, yardCapacity:420, scales:2, unloading:42, tonsToday:14200, vessels:8, scaleTime:41, dischargeTime:54, costToday:148000, shipsVisible:8}
};

const mapData = {
  // Centro ajustado a la zona real marcada: estacionamiento/carga/descarga/tolva junto al río.
  center: [-31.65915, -60.70420],
  zoom: 18,
  zones: [
    {key:"gate", name:"Acceso / Gate", text:"Ingreso de camiones", color:"#4fc368", cls:"green", center:[-31.65792,-60.70672],
      polygon:[[-31.65772,-60.70698],[-31.65758,-60.70652],[-31.65812,-60.70636],[-31.65824,-60.70682]], label:[-31.65785,-60.70745]},
    {key:"yard", name:"Playa de espera", text:"118 camiones · Cap. 160", color:"#f3cf42", cls:"yellow", center:[-31.65905,-60.70565],
      polygon:[[-31.65822,-60.70626],[-31.65825,-60.70500],[-31.65988,-60.70496],[-31.65990,-60.70622]], label:[-31.65896,-60.70695]},
    {key:"scale", name:"Balanzas", text:"2 operativas", color:"#2381d9", cls:"blue", center:[-31.66027,-60.70576],
      polygon:[[-31.66002,-60.70616],[-31.66002,-60.70535],[-31.66070,-60.70534],[-31.66070,-60.70610]], label:[-31.66022,-60.70722]},
    {key:"unload", name:"Tolva / Descarga", text:"12 camiones", color:"#ff8a22", cls:"orange", center:[-31.66118,-60.70538],
      polygon:[[-31.66085,-60.70580],[-31.66082,-60.70486],[-31.66158,-60.70483],[-31.66162,-60.70574]], label:[-31.66102,-60.70730]},
    {key:"silos", name:"Silos", text:"Cap. 120.000 tn", color:"#a276ff", cls:"purple", center:[-31.66185,-60.70455],
      polygon:[[-31.66128,-60.70502],[-31.66125,-60.70420],[-31.66230,-60.70415],[-31.66236,-60.70495]], label:[-31.66185,-60.70630]}
  ],
  dock: {name:"Muelle / zona de carga", center:[-31.65945,-60.70305],
    polygon:[[-31.65845,-60.70350],[-31.65845,-60.70265],[-31.66030,-60.70260],[-31.66035,-60.70342]]},
  routes: {
    in:[[-31.65720,-60.70755],[-31.65792,-60.70672],[-31.65905,-60.70565]],
    op:[[-31.65905,-60.70565],[-31.66027,-60.70576],[-31.66118,-60.70538],[-31.66185,-60.70455],[-31.65945,-60.70305]],
    out:[[-31.66118,-60.70538],[-31.66027,-60.70576],[-31.65755,-60.70785]]
  },
  ships:[
    {id:"BARCAZA 01", state:"Esperando para cargar", cargo:"Soja", loaded:0, total:3000, eta:"Inicio 13:45", ok:false, pos:[-31.65872,-60.70115]},
    {id:"BARCAZA 02", state:"Esperando para cargar", cargo:"Soja", loaded:0, total:3000, eta:"Inicio 11:30", ok:false, pos:[-31.66065,-60.70105]},
    {id:"BARCAZA 03", state:"Esperando turno", cargo:"Granel", loaded:0, total:4200, eta:"Inicio 15:10", ok:false, pos:[-31.65745,-60.70125]},
    {id:"BARCAZA 04", state:"Esperando para cargar", cargo:"Soja", loaded:0, total:3800, eta:"Inicio 17:20", ok:false, pos:[-31.66175,-60.70095]},
    {id:"BARCAZA 05", state:"Esperando turno", cargo:"Carga general", loaded:0, total:2600, eta:"Mañana", ok:false, pos:[-31.65625,-60.70140]},
    {id:"BARCAZA 06", state:"Programada", cargo:"Soja", loaded:0, total:3000, eta:"Mañana", ok:false, pos:[-31.66282,-60.70082]},
    {id:"BARCAZA 07", state:"ETA", cargo:"Granel", loaded:0, total:4100, eta:"Mañana", ok:false, pos:[-31.65520,-60.70155]},
    {id:"BARCAZA 08", state:"ETA", cargo:"Soja", loaded:0, total:3000, eta:"Mañana", ok:false, pos:[-31.66385,-60.70070]}
  ]
};
