# Modelo Visual Digital de Gestión Portuaria — Puerto Santa Fe

Demo web para presentar un modelo visual digital del Puerto de Santa Fe.

## Objetivo

Mostrar una primera versión navegable que permita visualizar:

- Operación de buques / barcazas.
- Ingreso y flujo de camiones.
- Gate, balanza, descarga, acopio y muelle.
- Indicadores operativos.
- Simulación de crecimiento a 2, 5 y 10 años.

## Cómo verlo localmente

Abrir `index.html` en el navegador.

> El mapa usa OpenStreetMap mediante Leaflet, por lo que requiere conexión a internet para cargar los tiles del mapa.

## Estructura

```text
index.html
src/
  app.js
  data.js
  styles.css
README.md
```

## Datos

Los datos son simulados para una prueba de concepto. Las coordenadas operativas son aproximadas y deben reemplazarse por coordenadas oficiales del Puerto cuando estén disponibles.

## Próximas integraciones posibles

- AIS para posición de buques.
- Sistema de turnos de camiones.
- Balanza.
- CCTV.
- Sensores IoT.
- Meteorología.
- ERP / sistemas administrativos.
- Indicadores de costos operativos.
