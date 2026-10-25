# XPeng 3D Card / Tarjeta XPeng 3D

A custom Lovelace **HACS Dashboard** card for XPeng vehicles, with a 3D GLB viewer, configurable paint color, and live Home Assistant entities.

Tarjeta personalizada **HACS Dashboard** para coches XPeng, con visor GLB 3D, color de carrocería configurable y estados en tiempo real de Home Assistant.

> **0.3.1 Developer preview / Vista preliminar:** A rotatable, recolorable **procedural SUV prototype** is now included, with door/trunk/bonnet state articulation. **This is NOT an exact XPeng G6 model**. An accurate articulated G6 GLB is still a future goal. / Incluye un **prototipo de SUV 3D**, giratorio y recoloreable, con puertas/maletero/capó vinculados a sensores. **No es un modelo exacto del XPeng G6**.

[![Add to HACS / Añadir a HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=sergey08&repository=xpeng-3d-card&category=plugin)

**One-click HACS repository link / Enlace para añadir el repositorio directamente a HACS.** HACS must be installed / HACS debe estar instalado.

## Installation / Instalación

1. HACS → Custom repositories / Repositorios personalizados → `https://github.com/sergey08/xpeng-3d-card` → **Dashboard**.
2. Choose the newest release / Selecciona la versión publicada más reciente e instala; recarga el navegador.
3. No GLB is required for the built-in procedural prototype / No hace falta GLB para el prototipo incluido. For an external model, set the `model` option / Para un modelo externo usa `model`.
4. Add a manual Lovelace card / Añade una tarjeta manual:

```yaml
type: custom:xpeng-3d-card
vehicle_model: g6_2025
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

## Versions / Versiones

- `v0.3.1` — fixes charging flap/cable placement on the opposite side; displays version in the card. / Corrige el lado de la tapa y del cable de carga; muestra la versión en la tarjeta.
- `v0.3.0` — live door, boot, bonnet, windows, charge port and plug-in cable on the built-in procedural model. / Estados en vivo de puertas, maletero, capó, ventanas, toma de carga y manguera.
- `v0.2.0` — initial interactive 3D preview. / Primer prototipo 3D interactivo.

Only GitHub Releases are user-facing HACS versions. Commits on `main` are development builds. / Solo las GitHub Releases son versiones de HACS para usuarios. Los commits de `main` son desarrollo.

See [CHANGELOG.md](CHANGELOG.md) for details / Consulta [CHANGELOG.md](CHANGELOG.md).

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

## Vehicle profiles / Perfiles de vehículos (v0.3.0-dev)

- `g6_2025` (default / predeterminado): G6 2025 facelift-inspired **stylized prototype**, with a thin front light bar. Not accurate manufacturer geometry / prototipo estilizado, no geometría oficial precisa.
- `g6_2024`: earlier G6-style prototype / prototipo del estilo anterior.

Choose in the visual card editor or YAML with `vehicle_model: g6_2025` / Selecciona en el editor visual o por YAML.

Future models will be added as profiles when suitable licensed articulated geometry is available / Se añadirán más modelos cuando existan geometrías articuladas con licencias adecuadas.

**This development commit is not a tagged HACS release yet / Este cambio de desarrollo aún no es una versión etiquetada de HACS.**

## Optional 3D model per vehicle / Modelo 3D opcional por vehículo

You can assign a licensed GLB separately to each car profile, while other profiles continue using the built-in simplified prototype. / Puedes asignar un GLB con licencia adecuada a cada perfil; los demás siguen usando el prototipo simplificado.

```yaml
type: custom:xpeng-3d-card
vehicle_model: g6_2025
color: "#73787d"
model_urls:
  g6_2025: /local/xpeng-3d-card/g6-2025.glb
```

The path above is only an **example**: no GLB is bundled or automatically downloaded. External GLB files currently support rotation and color-changing if paint materials are appropriately named; door/trunk articulation remains available only in the procedural prototype. / La ruta es un **ejemplo**: no se incluye ni descarga ningún GLB. Los archivos externos permiten giro y cambio de color si los materiales están identificados; la articulación de puertas y maletero sigue limitada al prototipo integrado.


## Live 3D states / Estados 3D en tiempo real (development / desarrollo)

The built-in procedural viewer listens to these entity keys / El visor geométrico incluido utiliza estas entidades:

| Feature / Función | Entity key / Clave |
|---|---|
| Four doors / Cuatro puertas | `door_fl`, `door_fr`, `door_rl`, `door_rr` |
| Tailgate and bonnet / Portón y capó | `trunk`, `bonnet` |
| Windows / Ventanillas | `windows` |
| Charge flap / Tapa de carga | `charge_port` |
| Visible charging cable / Manguera visible | `plugged` |
| Cable illuminated when actively charging / Cable iluminado cargando | `charge_power`, `charging` |

**Limitations / Limitaciones:** The common windows entity reports one aggregate state, so all four panes are shown or hidden together; this does not mean every individual window has opened. The cable is a symbolic visual, not an exact representation of the V2C Trydan. / El estado de ventanillas es conjunto, así que las cuatro se muestran u ocultan juntas. El cable es una representación visual simbólica.

This is a read-only visualization; no vehicle commands are issued. External GLBs still need articulated-node support. / Es una visualización de solo lectura; no envía órdenes al coche. Los GLB externos aún necesitan compatibilidad con articulaciones.

The changes above are currently on `main`; a tagged version has not yet been published. / Estos cambios están en `main`; todavía no se ha publicado una versión etiquetada.
