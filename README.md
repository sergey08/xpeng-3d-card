# XPeng 3D Card / Tarjeta XPeng 3D

A custom Lovelace **HACS Dashboard** card for XPeng vehicles, with a 3D GLB viewer, configurable paint color, and live Home Assistant entities.

Tarjeta personalizada **HACS Dashboard** para coches XPeng, con visor GLB 3D, color de carrocería configurable y estados en tiempo real de Home Assistant.

> **Developer preview / Vista preliminar:** The 3D XPeng G6 model is **not included**. To see the vehicle and animate parts you must provide a suitably licensed GLB with appropriately named meshes/animations. / No se incluye el modelo 3D del G6. Necesitas aportar un archivo GLB con licencia adecuada y piezas/animaciones compatibles.

## Installation / Instalación

1. HACS → Custom repositories / Repositorios personalizados → `https://github.com/sergey08/xpeng-3d-card` → **Dashboard**.
2. Install / Instalar y actualizar el navegador.
3. Put a licensed GLB at `/config/www/xpeng-3d-card/xpeng-g6.glb` (served as `/local/xpeng-3d-card/xpeng-g6.glb`).
4. Add a manual Lovelace card / Añade una tarjeta manual:

```yaml
type: custom:xpeng-3d-card
model: /local/xpeng-3d-card/xpeng-g6.glb
color: "#73787d"
height: 380
entities:
  door_fl: binary_sensor.driver_door_xpeng_135818
  door_fr: binary_sensor.passenger_door_xpeng_135818
  door_rl: binary_sensor.rear_left_door_xpeng_135818
  door_rr: binary_sensor.rear_right_door_xpeng_135818
  trunk: cover.trunk_xpeng_135818
  bonnet: binary_sensor.bonnet_xpeng_135818
  charge_port: cover.charge_port_xpeng_135818
  plugged: binary_sensor.plugged_in_xpeng_135818
  lock: lock.door_lock_xpeng_135818
  charging: sensor.charging_state_xpeng_135818
  charge_power: sensor.charge_power_xpeng_135818
  battery: sensor.evconduit_battery_level
```

## Current / Estado

- Configurable color, 3D orbit and zoom / color, giro y zoom.
- Door/trunk/bonnet/charging indicators and entity mapping / indicadores de puertas, maletero, capó y carga.
- Visual editor / editor visual.
- GLB animation support is **experimental** and requires suitable named animation clips. Not a replica of the XPeng app yet. / Animaciones GLB **experimentales**; requiere clips de animación compatibles. Todavía no reproduce la app XPeng.
- Uses Google's model-viewer CDN at runtime; internet access is required for first load. / Utiliza model-viewer desde CDN; requiere conexión a Internet inicialmente.

## Roadmap / Próximos pasos

1. Obtain/build licensed XPeng G6 articulated GLB / modelo GLB G6 articulado y con licencia.
2. Per-door, trunk and charge port articulation / animaciones independientes.
3. Better visual editor, localized labels, release automation / mejorar editor, idiomas y lanzamientos.

## License / Licencia

MIT for source code. Vehicle models are **not** licensed by this repository / MIT para el código; no incluye derechos sobre modelos de vehículos.
