# XPeng 3D Card / Tarjeta XPeng 3D

A custom Lovelace **HACS Dashboard** card for XPeng vehicles, with a 3D GLB viewer, configurable paint color, and live Home Assistant entities.

Tarjeta personalizada **HACS Dashboard** para coches XPeng, con visor GLB 3D, color de carrocería configurable y estados en tiempo real de Home Assistant.

> **0.2.0 Developer preview / Vista preliminar:** A rotatable, recolorable **procedural SUV prototype** is now included, with door/trunk/bonnet state articulation. **This is NOT an exact XPeng G6 model**. An accurate articulated G6 GLB is still a future goal. / Incluye un **prototipo de SUV 3D**, giratorio y recoloreable, con puertas/maletero/capó vinculados a sensores. **No es un modelo exacto del XPeng G6**.

[![Add to HACS / Añadir a HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=sergey08&repository=xpeng-3d-card&category=plugin)

**One-click HACS repository link / Enlace para añadir el repositorio directamente a HACS.** HACS must be installed / HACS debe estar instalado.

## Installation / Instalación

1. HACS → Custom repositories / Repositorios personalizados → `https://github.com/sergey08/xpeng-3d-card` → **Dashboard**.
2. Install / Instalar y actualizar el navegador.
3. No GLB is required for the built-in procedural prototype / No hace falta GLB para el prototipo incluido. For an external model, set the `model` option / Para un modelo externo usa `model`.
4. Add a manual Lovelace card / Añade una tarjeta manual:

```yaml
type: custom:xpeng-3d-card
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
- Built-in prototype articulates doors, bonnet and trunk when HA states change / El prototipo articula puertas, capó y maletero según HA.
- External GLB articulation remains a future enhancement / La articulación de modelos GLB externos sigue pendiente.
- Loads Three.js from jsDelivr for the procedural viewer (and Google's model-viewer for external GLB); internet access is needed / Usa Three.js desde jsDelivr para el prototipo (y model-viewer de Google para GLB externos); requiere Internet.

## Roadmap / Próximos pasos

1. Obtain/build licensed XPeng G6 articulated GLB / modelo GLB G6 articulado y con licencia.
2. Per-door, trunk and charge port articulation / animaciones independientes.
3. Better visual editor, localized labels, release automation / mejorar editor, idiomas y lanzamientos.

## License / Licencia

MIT for source code. Vehicle models are **not** licensed by this repository / MIT para el código; no incluye derechos sobre modelos de vehículos.


## Releasing / Publicar versiones

Releases are created manually to keep experimental commits separate from HACS releases.
Las versiones se publican manualmente para no distribuir automáticamente cada cambio de desarrollo.

1. Go to [Actions → Publish HACS release](https://github.com/sergey08/xpeng-3d-card/actions/workflows/publish-release.yml).
2. Click **Run workflow / Ejecutar flujo de trabajo** on `main`.
3. Enter a new version, for example `v0.2.0`; keep **prerelease** enabled while experimental.
4. The workflow validates the JavaScript and creates a GitHub Release containing `xpeng-3d-card.js` as a HACS-downloadable asset.
5. In HACS, refresh the repository information to detect the release / Actualiza la información del repositorio en HACS.

**Note / Nota:** A workflow file being committed does **not** publish a version by itself.
