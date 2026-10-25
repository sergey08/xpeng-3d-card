# 3D Model Contribution Guide / Guía para colaborar con modelos 3D

## English

We are creating an open-source Home Assistant dashboard card. The default target is the **facelift XPeng G6 introduced for Europe in 2025**, not the earlier 2024 exterior.

### Help us with reference photographs
If you own a 2025 G6, supply front, rear, both sides, front/rear three-quarter views; optionally doors, tailgate and charge flap open. Keep a similar camera height and park on level ground. Remove or obscure registration plates, faces, addresses and location metadata. **Do not upload private photos to a public GitHub issue without your permission.**

### 3D asset requirements
- Prefer Blender source (.blend) plus glTF binary (.glb) for the card.
- Geometry must be licensed for **public redistribution** in this repository, preferably CC0 or CC BY 4.0, or contributed by its original creator under an explicit written license. Buying a model is not the same as having redistribution rights.
- Keep independent objects or articulated nodes: `body_paint`, `door_fl`, `door_fr`, `door_rl`, `door_rr`, `trunk`, `bonnet`, `charge_port`, `windows`, and `wheels`.
- Doors should pivot around their correct physical hinges, the tailgate at its upper hinge, and the bonnet at its intended hinge.
- Reserve a named material `body_paint` for paint recoloring. Glass, wheels, lamps and trim must not inherit paint color.
- Correct scale, orientation and a visually reasonable polycount / texture size are more important than interior micro-detail.
- Document license, original creator and source URL, including any dependencies.
- The current procedural renderer uses +X as forward. GLB coordinate conversion can be handled by a future import adapter.

### Current limitations
External GLBs currently render and can be recolored when their material names match, but **do not yet animate their doors from Home Assistant states**. The built-in simplified model supports stateful articulation. Do not advertise full GLB support before the adapter is implemented.

## Español

Estamos creando una tarjeta abierta para Home Assistant. El modelo prioritario es el **XPeng G6 renovado presentado para Europa en 2025**, no el frontal anterior de 2024.

### Fotografías útiles
Frontal, trasera, ambos laterales y vistas en tres cuartos; opcionalmente puertas, portón y tapa de carga abiertos. El coche debe estar sobre suelo llano, con iluminación uniforme. Oculta matrícula, rostros, direcciones y metadatos de ubicación. **No publiques fotografías privadas en GitHub sin autorizarlo.**

### Requisitos del modelo
- Preferiblemente archivo editable Blender (.blend) y archivo exportado (.glb).
- Licencia que permita redistribución pública; idealmente CC0 o CC BY 4.0, o autorización expresa del autor. Comprar un modelo no implica poder redistribuirlo.
- Objetos separados y articulados: `body_paint`, `door_fl`, `door_fr`, `door_rl`, `door_rr`, `trunk`, `bonnet`, `charge_port`, `windows` y `wheels`.
- Pivotes en las bisagras reales de cada puerta, capó y portón.
- Material `body_paint` independiente de cristales, faros, llantas y molduras.
- Escala correcta y geometría/texturas optimizadas para mostrar el coche desde móvil.
- Documentar autor, origen, licencia y dependencias.

### Limitación actual
Los GLB externos pueden visualizarse y recolorearse si sus materiales tienen nombres reconocibles, pero **todavía no sincronizan las articulaciones con los sensores de Home Assistant**. Esa función existe actualmente solo en el prototipo geométrico incluido.
